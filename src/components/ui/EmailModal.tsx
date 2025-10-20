import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, User, MessageSquare, FileText, Check, AlertCircle, Inbox, Trash2, Archive, Star, Plus } from "lucide-react";
import { useCursor } from "./useCursor";
import { useMobileDetection } from "./useMobileDetection";

// Interface for form data
interface EmailFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Interface for email modal props - matching other modals
interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional custom initial position for the modal
  initialPosition?: { x: number; y: number };
  // Optional custom z-index for modal stacking
  customZIndex?: number;
}

// Mock inbox folders for native email client feel
const INBOX_FOLDERS = [
  { id: 'inbox', name: 'Inbox', icon: Inbox, count: 12, color: 'text-blue-600' },
  { id: 'starred', name: 'Starred', icon: Star, count: 3, color: 'text-yellow-500' },
  { id: 'sent', name: 'Sent', icon: Send, count: 47, color: 'text-green-600' },
  { id: 'archive', name: 'Archive', icon: Archive, count: 156, color: 'text-gray-600' },
  { id: 'trash', name: 'Trash', icon: Trash2, count: 8, color: 'text-red-600' },
];

// EmailModal component - native email client with macOS window behavior
const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  initialPosition,
  customZIndex
}) => {
  const setCursorType = useCursor();
  const isMobile = useMobileDetection();

  // Form state management
  const [formData, setFormData] = useState<EmailFormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Loading and response states
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: "" });

  // Form validation state
  const [errors, setErrors] = useState<Partial<EmailFormData>>({});

  // Window behavior states - matching other modals
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  // Selected folder state for inbox sidebar
  const [selectedFolder, setSelectedFolder] = useState('inbox');

  // Calculate initial position for the modal - matching other modals
  const getInitialPosition = (): { x: number; y: number } => {
    const modalWidth = 800; // Email modal width
    const modalHeight = 500; // Email modal height

    if (initialPosition) {
      // Use custom position if provided
      return {
        x: Math.max(0, Math.min(initialPosition.x, window.innerWidth - modalWidth)),
        y: Math.max(0, Math.min(initialPosition.y, window.innerHeight - modalHeight))
      };
    }

    // Default to center position
    return {
      x: (window.innerWidth - modalWidth) / 2,
      y: (window.innerHeight - modalHeight) / 2
    };
  };

  // Update drag constraints on mount and resize - matching other modals
  useEffect(() => {
    function updateConstraints() {
      if (modalContainerRef.current) {
        const modal = modalContainerRef.current;
        const modalRect = modal.getBoundingClientRect();
        setConstraints({
          left: -modalRect.left,
          top: -modalRect.top,
          right: window.innerWidth - modalRect.right,
          bottom: window.innerHeight - modalRect.bottom,
        });
      }
    }
    if (isOpen) {
      updateConstraints();
      window.addEventListener('resize', updateConstraints);
      return () => window.removeEventListener('resize', updateConstraints);
    }
  }, [isOpen]);

  // Prevent background scroll when modal is open - matching other modals
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof EmailFormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<EmailFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setResponse({ type: null, message: "" });

    try {
      // Send email via API route
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Success response
        setResponse({
          type: 'success',
          message: data.message || 'Email sent successfully! Thank you for your message.'
        });

        // Reset form after successful submission
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        // Error response
        setResponse({
          type: 'error',
          message: data.error || 'Failed to send email. Please try again.'
        });
      }
    } catch (error) {
      // Network or other errors
      setResponse({
        type: 'error',
        message: 'Failed to send email. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close - reset all states
  const handleClose = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setResponse({ type: null, message: "" });
    setIsLoading(false);
    setSelectedFolder('inbox');
    onClose();
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          tabIndex={-1}
          ref={modalRef}
        >
          {/* Overlay: covers the whole screen for visual effect - matching other modals */}
          <div
            className="fixed inset-0 bg-black/10 pointer-events-none"
            style={{ zIndex: 100 }}
          />

          {/* Draggable modal container positioned at custom location - matching other modals */}
          <motion.div
            className="absolute rounded-lg shadow-2xl overflow-hidden border border-white/30 bg-white pointer-events-auto"
            style={{
              width: isMobile ? '95vw' : '800px',
              height: '500px',
              left: getInitialPosition().x,
              top: getInitialPosition().y,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
              zIndex: customZIndex || 101 // Use custom z-index if provided
            }}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            drag
            dragConstraints={{
              left: -getInitialPosition().x,
              top: -getInitialPosition().y,
              right: window.innerWidth - getInitialPosition().x - (isMobile ? window.innerWidth * 0.95 : 800),
              bottom: window.innerHeight - getInitialPosition().y - 500,
            }}
            dragElastic={0.1}
            dragMomentum={false}
            ref={modalContainerRef}
            onClick={e => e.stopPropagation()}
            // Cursor logic for drag - matching other modals
            onMouseEnter={() => !isDragging && setCursorType("openhand")}
            onMouseLeave={() => { setCursorType("normal"); setIsDragging(false); }}
            onDragStart={() => { setCursorType("closedhand"); setIsDragging(true); }}
            onDragEnd={() => { setCursorType("openhand"); setIsDragging(false); }}
          >
            {/* Layout: Sidebar (left) and Main compose area (right) - similar to ExplorerModal */}
            <div className="flex flex-row w-full h-full">

              {/* Glassy left sidebar - inbox folders - hidden on mobile */}
              {!isMobile && (
                <div
                  className="flex flex-col justify-start items-stretch w-48 h-full px-0 py-0 border-r border-white/40"
                  style={{
                    background: "linear-gradient(to bottom, rgba(236,236,236,0.85) 60%, rgba(220,230,255,0.18) 100%)",
                    backdropFilter: "blur(18px) saturate(1.5)",
                    WebkitBackdropFilter: "blur(18px) saturate(1.5)",
                    boxShadow: "2px 0 24px 0 rgba(0,0,0,0.10) inset",
                    borderRight: "1.5px solid rgba(255,255,255,0.32)",
                  }}
                >
                {/* Mac window controls at the top of sidebar - matching other modals */}
                <div className="flex items-center gap-2 mt-3 mb-6 px-4">
                  <button
                    aria-label="Close"
                    onClick={handleClose}
                    className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 shadow hover:scale-110 transition-transform"
                    style={{ boxShadow: '0 1px 2px #0002' }}
                    onMouseEnter={() => setCursorType("pointinghand")}
                    onMouseLeave={() => setCursorType("normal")}
                  />
                  <button
                    aria-label="Minimize"
                    onClick={handleClose}
                    className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 shadow hover:scale-110 transition-transform"
                    style={{ boxShadow: '0 1px 2px #0002' }}
                    onMouseEnter={() => setCursorType("pointinghand")}
                    onMouseLeave={() => setCursorType("normal")}
                  />
                  <button
                    aria-label="Maximize"
                    onClick={handleClose}
                    className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 shadow hover:scale-110 transition-transform"
                    style={{ boxShadow: '0 1px 2px #0002' }}
                    onMouseEnter={() => setCursorType("pointinghand")}
                    onMouseLeave={() => setCursorType("normal")}
                  />
                </div>

                {/* Email app title */}
                <div className="px-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 tracking-tight">Mail</h3>
                </div>

                {/* Compose button */}
                <div className="px-4 mb-6">
                  <div className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm flex items-center gap-2 justify-center">
                    <Plus className="w-4 h-4" />
                    New Message
                  </div>
                </div>

                {/* Inbox folders list */}
                <div className="flex-1 px-2">
                  {INBOX_FOLDERS.map((folder) => {
                    const IconComponent = folder.icon;
                    const isSelected = selectedFolder === folder.id;

                    return (
                      <button
                        key={folder.id}
                        onClick={() => setSelectedFolder(folder.id)}
                        onMouseEnter={() => setCursorType("pointinghand")}
                        onMouseLeave={() => setCursorType("normal")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                          isSelected
                            ? 'bg-blue-100 text-blue-800 shadow-sm'
                            : 'text-gray-700 hover:bg-white/50'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${folder.color}`} />
                        <span className="flex-1 text-left font-medium">{folder.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {folder.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sidebar footer */}
                <div className="px-4 py-3 border-t border-white/30">
                  <div className="text-xs text-gray-600 text-center">
                    Portfolio Contact
                  </div>
                </div>
                </div>
              )}

              {/* Main compose area - right side */}
              <div className="flex-1 flex flex-col h-full bg-white">

                {/* Compose header with mobile window controls */}
                <div className="flex items-center h-12 px-6 border-b border-gray-200 bg-gray-50">
                  {/* Mobile window controls - only show on mobile */}
                  {isMobile && (
                    <div className="flex items-center gap-2 mr-4">
                      <button
                        aria-label="Close"
                        onClick={handleClose}
                        className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 shadow hover:scale-110 transition-transform"
                        style={{ boxShadow: '0 1px 2px #0002' }}
                        onMouseEnter={() => setCursorType("pointinghand")}
                        onMouseLeave={() => setCursorType("normal")}
                      />
                      <button
                        aria-label="Minimize"
                        onClick={handleClose}
                        className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 shadow hover:scale-110 transition-transform"
                        style={{ boxShadow: '0 1px 2px #0002' }}
                        onMouseEnter={() => setCursorType("pointinghand")}
                        onMouseLeave={() => setCursorType("normal")}
                      />
                      <button
                        aria-label="Maximize"
                        onClick={handleClose}
                        className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 shadow hover:scale-110 transition-transform"
                        style={{ boxShadow: '0 1px 2px #0002' }}
                        onMouseEnter={() => setCursorType("pointinghand")}
                        onMouseLeave={() => setCursorType("normal")}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">New Message</h2>
                  </div>
                </div>

                {/* Compose form area */}
                <div className="flex-1 p-6 overflow-y-auto">

                  {/* Success/Error message display */}
                  <AnimatePresence>
                    {response.type && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                          response.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {response.type === 'success' ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm font-medium">{response.message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email compose form */}
                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* From field (display only) */}
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <label className="text-sm font-medium text-gray-600 w-16">From:</label>
                      <div className="flex-1 text-sm text-gray-700">Portfolio Contact Form</div>
                    </div>

                    {/* To field (display only) */}
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <label className="text-sm font-medium text-gray-600 w-16">To:</label>
                      <div className="flex-1 text-sm text-gray-700">Syed Mohammad Anas</div>
                    </div>

                    {/* Name field */}
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <label htmlFor="name" className="text-sm font-medium text-gray-600 w-16">Name:</label>
                      <div className="flex-1">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          onMouseEnter={() => setCursorType("pointinghand")}
                          onMouseLeave={() => setCursorType("normal")}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Your full name"
                          disabled={isLoading}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                        )}
                      </div>
                    </div>

                    {/* Email field */}
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <label htmlFor="email" className="text-sm font-medium text-gray-600 w-16">Email:</label>
                      <div className="flex-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onMouseEnter={() => setCursorType("pointinghand")}
                          onMouseLeave={() => setCursorType("normal")}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="your.email@example.com"
                          disabled={isLoading}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject field */}
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-600 w-16">Subject:</label>
                      <div className="flex-1">
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          onMouseEnter={() => setCursorType("pointinghand")}
                          onMouseLeave={() => setCursorType("normal")}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm ${
                            errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="What is this about?"
                          disabled={isLoading}
                        />
                        {errors.subject && (
                          <p className="text-xs text-red-600 mt-1">{errors.subject}</p>
                        )}
                      </div>
                    </div>

                    {/* Message field */}
                    <div className="pt-4">
                      <textarea
                        id="message"
                        name="message"
                        rows={8}
                        value={formData.message}
                        onChange={handleInputChange}
                        onMouseEnter={() => setCursorType("pointinghand")}
                        onMouseLeave={() => setCursorType("normal")}
                        className={`w-full px-3 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-sm ${
                          errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Type your message here..."
                        disabled={isLoading}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-600 mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* Send button footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        All fields are required
                      </div>

                      {/* Send button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        onMouseEnter={() => setCursorType("pointinghand")}
                        onMouseLeave={() => setCursorType("normal")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                          isLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            {/* Loading spinner */}
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailModal;
