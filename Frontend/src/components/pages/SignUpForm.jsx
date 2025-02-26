"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Sun, Moon, Sparkles } from "lucide-react";
import {
  db,
  collection,
  addDoc,
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../firebase/firebase";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function SignUpForm() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    state: "",
    campus: "",
    course: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const sendOtp = async () => {
    const phoneNumber = `+91${formData.phone}`;
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          sendOtp();
        },
      },
      auth
    );

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      setIsModalOpen(true);
      toast.success("OTP sent to your phone number!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("There was an error sending the OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const confirmationResult = window.confirmationResult;
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
      setIsModalOpen(false);
      toast.success("OTP verified successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      return sendOtp();
    }

    try {
      // Add the form data to Firebase Firestore
      await addDoc(collection(db, "form_submissions"), formData);
      toast.success("Form submitted successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("There was an error submitting the form to Firestore.");
    }

    try {
      await axios.post("http://localhost:3000/submit-form", formData);
      toast.success("Form submitted successfully! Check your email.");
    } catch (error) {
      console.error("Error:", error);
      toast.error("There was an error submitting the form.");
    }
  };

  return (
    <div className="relative flex items-center justify-center p-4 overflow-hidden">
      <div className="w-[27vw] max-sm:w-[90vw] max-lg:w-[50vw] max-w-lg pt-0 max-sm:pt-0">
        <div
          className={`rounded-2xl p-8 transition-all duration-500 backdrop-blur-xl overflow-hidden relative ${
            isDarkMode ? "bg-gray-800/80" : "bg-white/80"
          }`}
        >
          <div
            className="absolute top-0 left-0 w-40 h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-red-400 to-pink-500 opacity-20 blur-2xl"
            style={{ zIndex: -1 }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-gradient-to-tr from-blue-400 via-teal-400 to-green-500 opacity-20 blur-2xl"
            style={{ zIndex: -1 }}
          ></div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className={`text-2xl font-bold mb-1 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Enquire Now
                <Sparkles
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-yellow-400" : "text-yellow-500"
                  }`}
                />
              </h1>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Start your journey with us
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                isDarkMode
                  ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                  : "bg-yellow-100 text-gray-700 hover:bg-yellow-200"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            {[
              {
                id: "fullName",
                type: "text",
                label: "Full Name",
                value: formData.fullName,
                pattern: "^[a-zA-Z ]{3,}$",
                error:
                  "Name must be at least 3 characters long and contain only letters and spaces.",
              },
              {
                id: "phone",
                type: "tel",
                label: "Phone Number",
                value: formData.phone,
                pattern: "^[0-9]{10}$",
                error: "Phone number must be 10 digits.",
              },
              {
                id: "email",
                type: "email",
                label: "Email Address",
                value: formData.email,
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                error: "Invalid email format.",
              },
            ].map((field) => (
              <div key={field.id} className="relative group">
                <input
                  type={field.type}
                  id={field.id}
                  value={field.value}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.id]: e.target.value })
                  }
                  className={`peer w-full rounded-xl px-4 pt-6 pb-2 text-sm outline-none transition-all duration-300 focus:ring-4 focus:ring-opacity-50 ${
                    isDarkMode
                      ? "bg-gray-700/50 text-white border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                      : "bg-white text-gray-800 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                  }`}
                  placeholder=" "
                  required
                  pattern={field.pattern}
                  title={field.error}
                />
                <label
                  htmlFor={field.id}
                  className={`absolute left-4 top-4 text-sm transition-all duration-300 cursor-text ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } peer-focus:text-xs peer-focus:top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base ${
                    isDarkMode
                      ? "peer-focus:text-yellow-400"
                      : "peer-focus:text-yellow-500"
                  }`}
                >
                  {field.label}
                </label>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  id: "state",
                  label: "Select State",
                  options: ["State 1", "State 2", "State 3"],
                },
                {
                  id: "campus",
                  label: "Select Campus",
                  options: ["Campus 1", "Campus 2", "Campus 3"],
                },
              ].map((select) => (
                <div key={select.id} className="relative">
                  <select
                    value={formData[select.id]}
                    onChange={(e) =>
                      setFormData({ ...formData, [select.id]: e.target.value })
                    }
                    className={`w-full appearance-none rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-4 focus:ring-opacity-50 ${
                      isDarkMode
                        ? "bg-gray-700/50 text-white border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                        : "bg-white text-gray-800 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                    }`}
                    required
                  >
                    <option value="">{select.label}</option>
                    {select.options.map((opt) => (
                      <option
                        key={opt}
                        value={opt.toLowerCase().replace(" ", "")}
                      >
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="relative">
              <select
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                className={`w-full appearance-none rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-4 focus:ring-opacity-50 ${
                  isDarkMode
                    ? "bg-gray-700/50 text-white border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                    : "bg-white text-gray-800 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                }`}
                required
              >
                <option value="">Select Course</option>
                {["Course 1", "Course 2", "Course 3"].map((course) => (
                  <option
                    key={course}
                    value={course.toLowerCase().replace(" ", "")}
                  >
                    {course}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={sendOtp}
              className={`w-full p-4 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              Send OTP
            </button>

            <button
              type="submit"
              className={`w-full p-4 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <ToastContainer className="mt-4" />
      <div id="recaptcha-container"></div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="OTP Verification"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="p-4">
          <h2 className="text-2xl mb-4">Verify OTP</h2>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-field mb-4"
            placeholder="Enter OTP"
            required
            pattern="^[0-9]{6}$"
            title="OTP must be 6 digits."
          />
          <button
            type="button"
            onClick={verifyOtp}
            className="w-full p-4 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 bg-yellow-500 hover:bg-yellow-600"
          >
            Verify OTP
          </button>
        </div>
      </Modal>
    </div>
  );
}
