import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for adding Doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: JSON.parse(address),
      date: Date.now()
    };

    const { error } = await supabase.from('doctors').insert([doctorData]);
    if (error) throw error;

    res.status(200).json({ success: true, message: "Doctor Added" });

  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const { data: appointmentData, error: apptError } = await supabase.from('appointments').select('*').eq('id', appointmentId).single()
        
        if (apptError) throw apptError;

        await supabase.from('appointments').update({ cancelled: true }).eq('id', appointmentId);

        // releasing doctor slot 
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

const allDoctors = async (req, res) => {
    try {
        const { data: doctors, error } = await supabase.from('doctors').select('id, name, email, image, speciality, degree, experience, about, available, fees, address, date, slots_booked')
        if (error) throw error;
        
        // Map id to _id for frontend compatibility
        const formattedDoctors = doctors.map(doc => ({...doc, _id: doc.id}));
        res.json({ success: true, doctors: formattedDoctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const { data: appointments, error } = await supabase.from('appointments').select('*')
        if (error) throw error;

        // map snake to camel and id to _id
        const formatted = appointments.map(app => ({
          ...app,
          _id: app.id,
          userId: app.user_id,
          docId: app.doc_id,
          slotDate: app.slot_date,
          slotTime: app.slot_time,
          userData: app.user_data,
          docData: app.doc_data,
          isCompleted: app.is_completed
        }));

        res.json({ success: true, appointments: formatted })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const { count: doctors, error: dErr } = await supabase.from('doctors').select('*', { count: 'exact', head: true })
        if (dErr) throw dErr;
        const { count: users, error: uErr } = await supabase.from('users').select('*', { count: 'exact', head: true })
        if (uErr) throw uErr;
        const { data: appointments, error: aErr } = await supabase.from('appointments').select('*').order('date', { ascending: false })
        if (aErr) throw aErr;

        const formattedAppts = appointments.slice(0,5).map(app => ({
          ...app,
          _id: app.id,
          userId: app.user_id,
          docId: app.doc_id,
          slotDate: app.slot_date,
          slotTime: app.slot_time,
          userData: app.user_data,
          docData: app.doc_data,
          isCompleted: app.is_completed
        }));

        const dashData = {
            doctors: doctors || 0,
            appointments: appointments.length || 0,
            patients: users || 0,
            latestAppointments: formattedAppts
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {loginAdmin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}