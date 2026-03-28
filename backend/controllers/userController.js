import validator from 'validator'
import bcrypt from 'bcrypt'
import { supabase } from "../config/supabase.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary'  
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client('675064680628-db7phu5urmqv3kvorpqtvgbj4tt3f68a.apps.googleusercontent.com');

// Helper to format appointment
const formatAppointment = (app) => ({
  ...app,
  _id: app.id,
  userId: app.user_id,
  docId: app.doc_id,
  slotDate: app.slot_date,
  slotTime: app.slot_time,
  userData: app.user_data,
  docData: app.doc_data,
  isCompleted: app.is_completed
});

// Helper to format user
const formatUser = (u) => ({ ...u, _id: u.id });
// Helper to format doctor
const formatDoctor = (doc) => ({ ...doc, _id: doc.id });

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.json({ success: false, message: 'Missing Details' })
        if (!validator.isEmail(email)) return res.json({ success: false, message: "Please enter a valid email" })
        if (password.length < 8) return res.json({ success: false, message: "Please enter a strong password" })

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = { name, email, password: hashedPassword }

        const { data: user, error } = await supabase.from('users').insert([userData]).select().single();
        if (error) throw error;
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single()

        if (error || !user) return res.json({ success: false, message: "User does not exist" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for Google Login
const googleLogin = async (req, res) => {
    try {
        const { token: idToken } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: '675064680628-db7phu5urmqv3kvorpqtvgbj4tt3f68a.apps.googleusercontent.com',
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
        
        let { data: user } = await supabase.from('users').select('*').eq('email', email).single();
        
        if (user) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            return res.json({ success: true, token });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Date.now().toString(), salt);
            
            const userData = { 
                name, 
                email, 
                password: hashedPassword,
                image: picture
            };
            
            const { data: newUser, error: insertError } = await supabase.from('users').insert([userData]).select().single();
            if (insertError) throw insertError;
            
            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
            return res.json({ success: true, token });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const { data: userData, error } = await supabase.from('users').select('id, name, email, image, phone, address, gender, dob, date').eq('id', userId).single()
        if (error) throw error;
        res.json({ success: true, userData: formatUser(userData) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) return res.json({ success: false, message: "Data Missing" })

        const updateData = { name, phone, address: JSON.parse(address), dob, gender };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            updateData.image = imageUpload.secure_url
        }
        const { error } = await supabase.from('users').update(updateData).eq('id', userId)
        if (error) throw error;
        res.json({ success: true, message: 'Profile Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body
        const { data: docDataFull, error: docError } = await supabase.from('doctors').select('*').eq('id', docId).single()
        if (docError) throw docError;
        
        let docData = formatDoctor(docDataFull);
        delete docData.password; // remove password from obj

        if (!docData.available) return res.json({ success: false, message: 'Doctor Not Available' })

        let slots_booked = docData.slots_booked || {}
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const { data: userDataFull, error: userError } = await supabase.from('users').select('*').eq('id', userId).single()
        if (userError) throw userError;
        
        let userData = formatUser(userDataFull);
        delete userData.password;

        delete docData.slots_booked

        const appointmentData = {
            user_id: userId,
            doc_id: docId,
            user_data: userData,
            doc_data: docData,
            amount: docData.fees,
            slot_time: slotTime,
            slot_date: slotDate,
            date: Date.now()
        }

        const { error: insertError } = await supabase.from('appointments').insert([appointmentData])
        if (insertError) throw insertError;

        await supabase.from('doctors').update({ slots_booked }).eq('id', docId)

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body
        const { data: appointmentData, error: apptError } = await supabase.from('appointments').select('*').eq('id', appointmentId).single()
        if (apptError) throw apptError;

        if (appointmentData.user_id !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }
        await supabase.from('appointments').update({ cancelled: true }).eq('id', appointmentId)

        const { doc_id, slot_date, slot_time } = appointmentData
        const { data: doctorData, error: docError } = await supabase.from('doctors').select('slots_booked').eq('id', doc_id).single()
        if (docError) throw docError;

        let slots_booked = doctorData.slots_booked || {}
        if (slots_booked[slot_date]) {
            slots_booked[slot_date] = slots_booked[slot_date].filter(e => e !== slot_time)
            await supabase.from('doctors').update({ slots_booked }).eq('id', doc_id)
        }
        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body
        const { data: appointments, error } = await supabase.from('appointments').select('*').eq('user_id', userId)
        if (error) throw error;
        res.json({ success: true, appointments: appointments.map(formatAppointment) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {registerUser, loginUser, googleLogin, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment}
