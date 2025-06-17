
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { AppSettings } from '../types';
import { isGeminiApiKeyConfigured } from '../services/geminiService';
import { 
    InformationCircleIcon, PhoneIcon, BuildingOffice2Icon, KeyIcon, 
    CheckCircleIcon, XCircleIcon, PhotoIcon, LinkIcon, ArrowDownTrayIcon, 
    CreditCardIcon, DevicePhoneMobileIcon, CurrencyDollarIcon, PaintBrushIcon, 
    EnvelopeIcon as EnvelopeOutlineIcon, ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
    UserCircleIcon, AdjustmentsHorizontalIcon // Added for Admin Profile & Font
} from '@heroicons/react/24/outline';
import Input from '../components/Input';
import Button from '../components/Button';
import { DEFAULT_APP_SETTINGS } from '../constants'; 

interface AdminSettingsPageProps {
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  headingTextColor?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ appSettings, setAppSettings, headingTextColor: pageHeadingColor }) => {
  const geminiConfigured = isGeminiApiKeyConfigured();
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(appSettings);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(appSettings.collegeLogo);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // States for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  useEffect(() => {
    setCurrentSettings(appSettings);
    setLogoPreview(appSettings.collegeLogo);
  }, [appSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    if (type === 'number') {
        processedValue = parseFloat(value) || 0;
        if (name === 'smtpPort' && processedValue < 0) processedValue = 0;
        if (name === 'applicationFee' && processedValue < 0) processedValue = 0;
    }
    
    setCurrentSettings(prev => ({
       ...prev, 
       [name]: processedValue
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setLogoPreview(base64);
        setCurrentSettings(prev => ({ ...prev, collegeLogo: base64 }));
      } catch (error) {
        console.error("Error converting logo to Base64:", error);
        alert("Error processing logo file. Please try another image.");
        setLogoPreview(currentSettings.collegeLogo); 
         if (e.target) e.target.value = ''; 
      }
    }
  };
  
  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    setCurrentSettings(prev => ({...prev, collegeLogo: undefined}));
  }

  const handleSaveSettings = () => {
    setIsSaving(true);
    setSaveStatus(null);

    let finalSettings = { ...currentSettings };

    // Password change logic
    if (newPassword) { // Attempting password change
        if (currentPassword !== appSettings.adminPassword) {
            setSaveStatus({ type: 'error', message: "Current password does not match. Profile changes not saved." });
            setIsSaving(false);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setSaveStatus({ type: 'error', message: "New passwords do not match. Profile changes not saved." });
            setIsSaving(false);
            return;
        }
        if (newPassword.length < 6) { // Basic length validation
            setSaveStatus({ type: 'error', message: "New password must be at least 6 characters long. Profile changes not saved." });
            setIsSaving(false);
            return;
        }
        finalSettings.adminPassword = newPassword;
    }

    setTimeout(() => {
      setAppSettings(finalSettings);
      setIsSaving(false);
      setSaveStatus({ type: 'success', message: "Settings saved successfully." });
      // Clear password fields after successful save
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setSaveStatus(null), 3000); 
    }, 1000);
  };
  
  const currentPrimaryColor = currentSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor || 'sky-600';
  const getHoverColor = (color: string) => {
    if (color.includes('-')) { 
        const parts = color.split('-');
        const shade = parseInt(parts[1]);
        if (!isNaN(shade) && shade < 900) return `${parts[0]}-${Math.min(900, shade + 100)}`;
    }
    return color; 
  };
  const saveButtonCustomStyle = {
      backgroundColor: currentPrimaryColor.startsWith('#') ? currentPrimaryColor : undefined,
  };
   const saveButtonClassName = currentPrimaryColor.startsWith('#') 
    ? `text-white focus:ring-2 focus:ring-offset-2 focus:ring-[${currentPrimaryColor}]` 
    : `bg-${currentPrimaryColor} hover:bg-${getHoverColor(currentPrimaryColor)} text-white focus:ring-${currentPrimaryColor.split('-')[0]}-500`;

  const dynamicHeadingStyle = pageHeadingColor?.startsWith('#') ? { color: pageHeadingColor } : {};
  const dynamicHeadingClass = pageHeadingColor?.startsWith('#') ? '' : pageHeadingColor;


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={`text-3xl font-semibold ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>Admin Settings</h2>
        <Button 
            onClick={handleSaveSettings} 
            isLoading={isSaving} 
            disabled={isSaving} 
            leftIcon={<ArrowDownTrayIcon className="h-5 w-5"/>} 
            className={`w-full sm:w-auto ${saveButtonClassName}`}
            style={saveButtonCustomStyle}
        >
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      {saveStatus && (
        <div role="alert" className={`border-l-4 p-4 rounded-md ${saveStatus.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
          <p className="font-bold">{saveStatus.type === 'success' ? 'Success!' : 'Error!'}</p>
          <p>{saveStatus.message}</p>
        </div>
      )}
      
      {/* Admin Profile Settings Card */}
      <Card title="Admin Profile Settings" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <UserCircleIcon className="h-6 w-6 text-indigo-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Admin Profile Settings</h3>
        </div>
        <div className="p-5 space-y-6">
          <div>
            <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <Input
              id="adminUsername"
              name="adminUsername"
              value={currentSettings.adminUsername || 'admin'} // Default to 'admin' if not set
              readOnly
              disabled 
              className="bg-slate-100 cursor-not-allowed"
            />
             <p className="text-xs text-slate-500 mt-1">Username is fixed as 'admin' in this version.</p>
          </div>
          <Input
            label="Admin Email"
            id="adminEmail"
            name="adminEmail"
            type="email"
            value={currentSettings.adminEmail || ''}
            onChange={handleInputChange}
            placeholder="e.g., admin@example.com"
          />
          <hr className="my-4"/>
          <h4 className="text-md font-medium text-slate-700">Change Password</h4>
          <Input
            label="Current Password"
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min. 6 characters)"
          />
          <Input
            label="Confirm New Password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        <div className="p-4 bg-red-50 border-t border-red-200">
          <p className="text-xs text-red-700 flex items-start">
            <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-red-600 flex-shrink-0"/>
            <strong>Security Warning:</strong> For demonstration purposes, the admin password is saved in your browser's local storage. This is <strong>NOT SECURE</strong> for a real application. In a production environment, passwords must be handled by a secure backend system with proper hashing and storage.
          </p>
        </div>
      </Card>

      {/* Theme & Appearance Card */}
      <Card title="Theme & Appearance" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <PaintBrushIcon className="h-6 w-6 text-purple-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Theme & Appearance</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input
            label="Primary Color (Tailwind Class or Hex)"
            id="primaryColor"
            name="primaryColor"
            value={currentSettings.primaryColor || ''}
            onChange={handleInputChange}
            placeholder="e.g., sky-600, indigo-500, or #0EA5E9"
          />
           <p className="text-xs text-slate-500 -mt-3">
              Used for main buttons, active links, etc. Examples: <code>sky-600</code>, <code>green-500</code>, <code>#FF5733</code>.
              Changes to app name, sidebar active item, and avatar will apply immediately after save.
            </p>

          <div>
            <label htmlFor="contentBackgroundTheme" className="block text-sm font-medium text-gray-700 mb-1">Content Area Background</label>
            <select
              id="contentBackgroundTheme"
              name="contentBackgroundTheme"
              value={currentSettings.contentBackgroundTheme || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="slate-100">Slate 100 (Default Light)</option>
              <option value="white">White</option>
              <option value="gray-100">Gray 100</option>
              <option value="slate-200">Slate 200 (Darker Light)</option>
              <option value="gray-200">Gray 200</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Select a background color for the main content area of the admin panel.</p>
          </div>
          
          <hr className="my-4"/>
          <h4 className="text-md font-medium text-slate-700 flex items-center"><AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-purple-500"/> Text & Font Settings</h4>
          
          <Input
            label="Main Text Color (Tailwind Class or Hex)"
            id="mainTextColor"
            name="mainTextColor"
            value={currentSettings.mainTextColor || ''}
            onChange={handleInputChange}
            placeholder="e.g., text-slate-700 or #334155"
          />
          <p className="text-xs text-slate-500 -mt-3">Default color for paragraphs and general text content.</p>

          <Input
            label="Heading Text Color (Tailwind Class or Hex)"
            id="headingTextColor"
            name="headingTextColor"
            value={currentSettings.headingTextColor || ''}
            onChange={handleInputChange}
            placeholder="e.g., text-slate-800 or #1E293B"
          />
          <p className="text-xs text-slate-500 -mt-3">Color for main page titles and card titles.</p>

           <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-1">Application Font Family</label>
            <select
              id="fontFamily"
              name="fontFamily"
              value={currentSettings.fontFamily || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="font-sans">Sans-Serif (Default - Inter)</option>
              <option value="font-serif">Serif (e.g., Times New Roman)</option>
              <option value="font-mono">Monospace (e.g., Courier New)</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Changes the global font style for the application.</p>
          </div>
        </div>
      </Card>


      <Card title="Application Information" className="shadow-lg">
         <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <BuildingOffice2Icon className="h-6 w-6 text-sky-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Application Information</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input
            label="Application Name"
            id="appName"
            name="appName"
            value={currentSettings.appName}
            onChange={handleInputChange}
            placeholder="e.g., Christian University College"
          />
          <Input
            label="College Address"
            id="collegeAddress"
            name="collegeAddress"
            value={currentSettings.collegeAddress}
            onChange={handleInputChange}
            placeholder="e.g., 123 University Ave, City, Country"
          />
          <Input
            label="Contact Phone"
            id="collegePhone"
            name="collegePhone"
            type="tel"
            value={currentSettings.collegePhone}
            onChange={handleInputChange}
            placeholder="e.g., +1-555-123-4567"
          />
          <Input
            label="WhatsApp Number (Optional)"
            id="collegeWhatsApp"
            name="collegeWhatsApp"
            type="tel"
            value={currentSettings.collegeWhatsApp || ''}
            onChange={handleInputChange}
            placeholder="e.g., +15551234567 (include country code)"
          />
          <div>
            <label htmlFor="collegeLogo" className="block text-sm font-medium text-gray-700 mb-1">
              College Logo (Optional)
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-4">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="h-16 w-auto object-contain bg-slate-200 p-1 rounded-md" />
              ) : (
                <div className="h-16 w-28 bg-slate-200 rounded-md flex items-center justify-center text-slate-400">
                  <PhotoIcon className="h-8 w-8" />
                </div>
              )}
              <input
                type="file"
                id="collegeLogo"
                name="collegeLogo"
                accept="image/png, image/jpeg, image/gif, image/svg+xml"
                onChange={handleLogoChange}
                className="block w-full max-w-xs text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-700
                  hover:file:bg-sky-100"
              />
              {logoPreview && <Button variant='ghost' size='sm' onClick={handleRemoveLogo}>Remove Logo</Button>}
            </div>
            <p className="text-xs text-slate-500 mt-1">Recommended: PNG, JPG, GIF, or SVG. Max 2MB.</p>
          </div>
        </div>
      </Card>

      <Card title="Payment Configuration" className="shadow-lg">
         <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Payment Configuration</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input
            label="Application Fee (Optional, e.g., 25.00)"
            id="applicationFee"
            name="applicationFee"
            type="number"
            value={currentSettings.applicationFee?.toString() || '0'}
            onChange={handleInputChange}
            placeholder="Enter amount (e.g., 25.00)"
            min="0"
            step="0.01"
          />
          <h3 className="text-lg font-medium text-slate-700 pt-2 border-t mt-4">Bank Account Details</h3>
          <Input
            label="Bank Name"
            id="bankName"
            name="bankName"
            value={currentSettings.bankName || ''}
            onChange={handleInputChange}
            placeholder="e.g., Equity Bank Liberia Limited"
          />
          <Input
            label="Account Name"
            id="bankAccountName"
            name="bankAccountName"
            value={currentSettings.bankAccountName || ''}
            onChange={handleInputChange}
            placeholder="e.g., Christian University College"
          />
          <Input
            label="Account Number"
            id="bankAccountNumber"
            name="bankAccountNumber"
            value={currentSettings.bankAccountNumber || ''}
            onChange={handleInputChange}
            placeholder="e.g., 001122334455"
          />
          <Input
            label="SWIFT Code (Optional)"
            id="bankSwiftCode"
            name="bankSwiftCode"
            value={currentSettings.bankSwiftCode || ''}
            onChange={handleInputChange}
            placeholder="e.g., EQBLMWMXXX"
          />
          <h3 className="text-lg font-medium text-slate-700 pt-2 border-t mt-4">Mobile Money Details</h3>
           <Input
            label="Mobile Money Provider"
            id="mobileMoneyProvider"
            name="mobileMoneyProvider"
            value={currentSettings.mobileMoneyProvider || ''}
            onChange={handleInputChange}
            placeholder="e.g., MTN Mobile Money, Orange Money"
          />
          <Input
            label="Mobile Money Number"
            id="mobileMoneyNumber"
            name="mobileMoneyNumber"
            type="tel"
            value={currentSettings.mobileMoneyNumber || ''}
            onChange={handleInputChange}
            placeholder="e.g., 0770123456"
          />
        </div>
        <div className="p-4 bg-slate-50 border-t">
             <p className="text-xs text-slate-500 flex items-start">
                <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-sky-600 flex-shrink-0"/>
                This information will be displayed to applicants for manual payment of application fees, if an Application Fee is set.
            </p>
        </div>
      </Card>
      
      {/* Email Configuration Card */}
      <Card title="Email Configuration (SMTP)" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <EnvelopeOutlineIcon className="h-6 w-6 text-blue-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Email Configuration (SMTP)</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input label="SMTP Server" id="smtpServer" name="smtpServer" value={currentSettings.smtpServer || ''} onChange={handleInputChange} placeholder="e.g., smtp.example.com" />
          <Input label="SMTP Port" id="smtpPort" name="smtpPort" type="number" value={currentSettings.smtpPort?.toString() || ''} onChange={handleInputChange} placeholder="e.g., 587 or 465" />
          <Input label="SMTP Username" id="smtpUsername" name="smtpUsername" value={currentSettings.smtpUsername || ''} onChange={handleInputChange} placeholder="e.g., user@example.com" />
          <Input label="SMTP Password" id="smtpPassword" name="smtpPassword" type="password" value={currentSettings.smtpPassword || ''} onChange={handleInputChange} placeholder="Enter SMTP password" />
          <Input label="Default 'From' Email Address" id="smtpFromEmail" name="smtpFromEmail" type="email" value={currentSettings.smtpFromEmail || ''} onChange={handleInputChange} placeholder="e.g., no-reply@example.com" />
        </div>
        <div className="p-4 bg-slate-50 border-t">
          <p className="text-xs text-slate-500 flex items-start">
            <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-sky-600 flex-shrink-0"/>
            These settings are for sending system emails (e.g., notifications, password resets - features not yet implemented). Ensure your provider's details are correct.
          </p>
        </div>
      </Card>

      {/* SMS Configuration Card */}
      <Card title="SMS Configuration" className="shadow-lg">
         <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <ChatBubbleLeftRightIconOutline className="h-6 w-6 text-teal-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">SMS Configuration</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input label="SMS Gateway API URL" id="smsApiUrl" name="smsApiUrl" value={currentSettings.smsApiUrl || ''} onChange={handleInputChange} placeholder="e.g., https://api.sms_provider.com/send" />
          <Input label="SMS Gateway API Key/Token" id="smsApiKey" name="smsApiKey" type="password" value={currentSettings.smsApiKey || ''} onChange={handleInputChange} placeholder="Enter SMS API Key" />
          <Input label="SMS Sender ID" id="smsSenderId" name="smsSenderId" value={currentSettings.smsSenderId || ''} onChange={handleInputChange} placeholder="e.g., YourAppName" />
        </div>
         <div className="p-4 bg-slate-50 border-t">
          <p className="text-xs text-slate-500 flex items-start">
            <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-sky-600 flex-shrink-0"/>
            Configure your SMS provider details for sending messages (e.g., OTPs, alerts - features not yet implemented).
          </p>
        </div>
      </Card>


      <Card title="API Configuration Status" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <KeyIcon className="h-6 w-6 text-amber-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">API Configuration Status</h3>
        </div>
        <div className="p-5">
           <div className="flex items-center">
            <KeyIcon className="h-6 w-6 text-sky-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-500">Google Gemini API Key</p>
              {geminiConfigured ? (
                <div className="flex items-center mt-1">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                  <p className="text-lg font-medium text-green-600">Configured and Active</p>
                </div>
              ) : (
                <div className="flex items-center mt-1">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                  <p className="text-lg font-medium text-red-600">Not Configured or Error</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t">
             <p className="text-xs text-slate-500">
                The Gemini API key is managed via environment variables on the server. This status reflects whether the application was able to initialize the API client. AI-powered features depend on this configuration.
            </p>
        </div>
      </Card>
      
       <Card title="More Settings" className="shadow-lg opacity-70">
        <div className="p-5">
          <p className="text-slate-600">This section is reserved for future administrative settings.</p>
          <ul className="list-disc list-inside text-slate-500 mt-2 text-sm space-y-1">
            <li>User role management</li>
            <li>Advanced integration management</li>
          </ul>
        </div>
      </Card>

    </div>
  );
};

export default AdminSettingsPage;
