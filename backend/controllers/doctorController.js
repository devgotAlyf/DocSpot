import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";

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

// Helper to format doctor
const formatDoctor = (doc) => ({
  ...doc,
  _id: doc.id
});

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: user, error } = await supabase.from('doctors').select('*').eq('email', email).single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.user.id;
    const { data: appointments, error } = await supabase.from('appointments').select('*').eq('doc_id', docId);
    if (error) throw error;
    res.json({ success: true, appointments: appointments.map(formatAppointment) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId } = req.body;

    const { data: appointment, error: getErr } = await supabase.from('appointments').select('*').eq('id', appointmentId).single();
    if (getErr || !appointment || appointment.doc_id !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
    }

    const { error: updErr } = await supabase.from('appointments').update({ cancelled: true }).eq('id', appointmentId);
    if (updErr) throw updErr;

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete appointment
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId } = req.body;

    const { data: appointment, error: getErr } = await supabase.from('appointments').select('*').eq('id', appointmentId).single();
    if (getErr || !appointment || appointment.doc_id !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
    }

    const { error: updErr } = await supabase.from('appointments').update({ is_completed: true }).eq('id', appointmentId);
    if (updErr) throw updErr;

    res.json({ success: true, message: "Appointment Completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all doctors (for frontend list)
const doctorList = async (req, res) => {
  try {
    const { data: doctors, error } = await supabase.from('doctors').select('id, name, image, speciality, degree, experience, about, available, fees, address, slots_booked, date');
    if (error) throw error;
    res.json({ success: true, doctors: doctors.map(formatDoctor) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle doctor's availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID missing" });
    }

    const { data: doctor, error: getErr } = await supabase.from('doctors').select('available').eq('id', docId).single();

    if (getErr || !doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const { error: updErr } = await supabase.from('doctors').update({ available: !doctor.available }).eq('id', docId);
    if (updErr) throw updErr;

    res.json({ success: true, message: "Availability changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's profile
const doctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const { data: profile, error } = await supabase.from('doctors').select('id, name, email, image, speciality, degree, experience, about, available, fees, address, slots_booked, date').eq('id', docId).single();
    if (error) throw error;
    res.json({ success: true, profileData: formatDoctor(profile) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor's profile
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const { fees, address, available, about } = req.body; 

    const { error } = await supabase.from('doctors').update({
      fees: Number(fees),
      address,
      available,
      about
    }).eq('id', docId);

    if (error) throw error;

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.user.id;
    const { data: appointments, error } = await supabase.from('appointments').select('*').eq('doc_id', docId);
    if (error) throw error;

    let earnings = 0;
    const patientSet = new Set();

    const formattedAppts = appointments.map(formatAppointment);

    formattedAppts.forEach((a) => {
      if (a.isCompleted || a.payment) earnings += a.amount;
      patientSet.add(a.userId.toString());
    });

    const dashData = {
      earnings,
      appointments: formattedAppts.length,
      patients: patientSet.size,
      latestAppointments: formattedAppts.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorList,
  changeAvailability,
  doctorProfile,
  updateDoctorProfile,
  doctorDashboard,
};
