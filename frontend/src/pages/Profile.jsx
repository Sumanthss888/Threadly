import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, CheckCircle, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: ''
  });

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/user/profile', {
        headers: { token }
      });
      if (response.data.success) {
        setProfileData(response.data.profile);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await axios.post(
        backendUrl + '/api/user/update-profile',
        profileData,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message || 'Profile updated successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Extract initials for the avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-semibold mb-4">Please log in to view your profile.</h2>
      </div>
    );
  }

  return (
    <div className="py-10 border-t min-h-[80vh] flex flex-col">
      <div className="text-center text-2xl mb-8">
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-apple-text border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Avatar / Sidebar Card */}
          <div className="md:col-span-1 bg-white/70 backdrop-blur-md border border-[#111111]/5 rounded-2xl p-6 flex flex-col items-center text-center shadow-apple-md">
            <div className="w-24 h-24 rounded-full bg-[#C89B3C] text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
              {getInitials(profileData.name)}
            </div>
            <h3 className="text-lg font-semibold text-apple-text">{profileData.name}</h3>
            <p className="text-xs text-apple-textMuted mb-6 flex items-center gap-1.5 justify-center mt-1">
              <Mail size={12} /> {profileData.email}
            </p>
            <div className="w-full h-[1px] bg-[#111111]/5 my-4" />
            <div className="text-left w-full mt-2 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-xs text-apple-textMuted">
                <CheckCircle size={14} className="text-green-500" />
                <span>Verified Account</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-apple-textMuted">
                <CheckCircle size={14} className="text-green-500" />
                <span>Threadly Silver Member</span>
              </div>
            </div>
          </div>

          {/* Edit Form Card */}
          <div className="md:col-span-2 bg-white/70 backdrop-blur-md border border-[#111111]/5 rounded-2xl p-8 shadow-apple-md">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Personal Section */}
              <div>
                <h4 className="text-[14px] font-semibold text-apple-text mb-4 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} /> Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-apple-textMuted mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={profileData.name} 
                      onChange={handleInputChange}
                      className="w-full bg-white/80 border border-[#111111]/10 rounded-xl px-4 py-3 text-[14px] focus:border-[#C89B3C] focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-apple-textMuted mb-1.5">Phone Number</label>
                    <div className="relative flex items-center">
                      <Phone size={14} className="absolute left-4 text-apple-textMuted" />
                      <input 
                        type="tel" 
                        name="phone"
                        placeholder="+1 (555) 012-3456"
                        value={profileData.phone} 
                        onChange={handleInputChange}
                        className="w-full bg-white/80 border border-[#111111]/10 rounded-xl pl-11 pr-4 py-3 text-[14px] focus:border-[#C89B3C] focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-[#111111]/5" />

              {/* Delivery Section */}
              <div>
                <h4 className="text-[14px] font-semibold text-apple-text mb-4 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={16} /> Shipping Address
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-medium text-apple-textMuted mb-1.5">Street Address</label>
                    <input 
                      type="text" 
                      name="street"
                      placeholder="123 Main St, Apt 4B"
                      value={profileData.street} 
                      onChange={handleInputChange}
                      className="w-full bg-white/80 border border-[#111111]/10 rounded-xl px-4 py-3 text-[14px] focus:border-[#C89B3C] focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-apple-textMuted mb-1.5">City</label>
                      <input 
                        type="text" 
                        name="city"
                        placeholder="New York"
                        value={profileData.city} 
                        onChange={handleInputChange}
                        className="w-full bg-white/80 border border-[#111111]/10 rounded-xl px-4 py-3 text-[14px] focus:border-[#C89B3C] focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-apple-textMuted mb-1.5">State</label>
                      <input 
                        type="text" 
                        name="state"
                        placeholder="NY"
                        value={profileData.state} 
                        onChange={handleInputChange}
                        className="w-full bg-white/80 border border-[#111111]/10 rounded-xl px-4 py-3 text-[14px] focus:border-[#C89B3C] focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-apple-textMuted mb-1.5">ZIP Code / Postal Code</label>
                      <input 
                        type="text" 
                        name="zipcode"
                        placeholder="10001"
                        value={profileData.zipcode} 
                        onChange={handleInputChange}
                        className="w-full bg-white/80 border border-[#111111]/10 rounded-xl px-4 py-3 text-[14px] focus:border-[#C89B3C] focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-apple-textMuted mb-1.5">Country</label>
                      <input 
                        type="text" 
                        name="country"
                        placeholder="United States"
                        value={profileData.country} 
                        onChange={handleInputChange}
                        className="w-full bg-white/80 border border-[#111111]/10 rounded-xl px-4 py-3 text-[14px] focus:border-[#C89B3C] focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving}
                  className="bg-apple-text text-white px-8 py-3.5 rounded-xl font-medium text-[14px] flex items-center gap-2 hover:bg-black/95 transition-all shadow-md"
                >
                  <Save size={16} />
                  {saving ? 'Saving Details...' : 'Save Profile'}
                </motion.button>
              </div>

            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
