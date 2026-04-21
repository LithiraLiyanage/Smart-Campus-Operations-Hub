import React, { useEffect, useId, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeCheck,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User as UserIcon,
  UserRound,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const navigate = useNavigate();
  const descId = useId();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loginType, setLoginType] = useState<'USER' | 'ADMIN'>('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  
  // Form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'USER' | 'ADMIN'>('USER');
  const [adminApprovalCode, setAdminApprovalCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (key: string) => setTouched((t) => ({ ...t, [key]: true }));

  const patterns = useMemo(
    () => ({
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      passwordUpper: /[A-Z]/,
      passwordLower: /[a-z]/,
      passwordNum: /\d/,
      passwordSpecial: /[!@#$%^&*(),.?":{}|<>]/,
      username: /^[a-zA-Z0-9._-]+$/,
    }),
    []
  );

  const isEmailValid = patterns.email.test(email.trim());
  const isAdminLoginEmailValid = patterns.email.test(loginIdentifier.trim());
  const isUserLoginIdentifierEmail = patterns.email.test(loginIdentifier.trim());
  const isUserLoginIdentifierValid =
    loginIdentifier.trim().length >= 3 && (isUserLoginIdentifierEmail || loginIdentifier.trim().length >= 3);

  const hasMinLen = password.length >= 8;
  const hasUpper = patterns.passwordUpper.test(password);
  const hasLower = patterns.passwordLower.test(password);
  const hasNum = patterns.passwordNum.test(password);
  const hasSpecial = patterns.passwordSpecial.test(password);
  const isPasswordValid = hasMinLen && hasUpper && hasLower && hasNum && hasSpecial;

  const isUsernameValid = username.trim().length >= 3 && patterns.username.test(username.trim());
  const isFullNameValid = fullName.trim().length >= 2;
  const isConfirmPasswordValid = confirmPassword.length > 0 && password === confirmPassword;
  const isAdminApprovalCodeRequired = signupRole === 'ADMIN';
  const isAdminApprovalCodeValid = !isAdminApprovalCodeRequired || adminApprovalCode.trim().length >= 6;

  const isLoginValid =
    (loginType === 'ADMIN' ? isAdminLoginEmailValid : isUserLoginIdentifierValid) && password.trim().length > 0;
  const isSignupValid =
    isFullNameValid &&
    isEmailValid &&
    isUsernameValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isAdminApprovalCodeValid &&
    acceptedTerms;
  
  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setTouched({});
    setRememberMe(false);
    setAcceptedTerms(false);
    setSignupRole('USER');
    setAdminApprovalCode('');
    setLoginType('USER');
    setLoginIdentifier('');
    setEmail('');
    setPassword('');
    setUsername('');
    setFullName('');
    setConfirmPassword('');
  }, [isOpen, initialMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    // Touch all relevant fields to show validation.
    if (mode === 'login') {
      setTouched((t) => ({ ...t, loginIdentifier: true, password: true }));
      if (!isLoginValid) return;
    } else {
      setTouched((t) => ({
        ...t,
        fullName: true,
        email: true,
        username: true,
        password: true,
        confirmPassword: true,
        adminApprovalCode: true,
        acceptedTerms: true,
      }));
      if (!isSignupValid) return;
    }

    setIsSubmitting(true);
    try {
      // Demo-only async behavior to mimic real API latency.
      await new Promise((r) => setTimeout(r, 900));

      if (mode === 'login') {
        onClose();
        navigate('/login', { state: { role: loginType, rememberMe } });
        return;
      }

      if (signupRole === 'ADMIN' && adminApprovalCode.trim().length < 6) {
        setSubmitError('Admin registration requires a valid approval code.');
        return;
      }

      setSubmitSuccess('Account created successfully. Please sign in to continue.');
      setMode('login');
      setLoginType('USER');
      setLoginIdentifier(email.trim());
      setPassword('');
      setConfirmPassword('');
      setAcceptedTerms(false);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset states on close
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const loginIdentifierLabel = loginType === 'ADMIN' ? 'Email Address' : 'Email or Username';
  const loginIdentifierPlaceholder = loginType === 'ADMIN' ? 'admin@university.edu' : 'Email or Username';

  const fieldError = (key: string): string | null => {
    if (!touched[key]) return null;

    if (mode === 'login') {
      if (key === 'loginIdentifier') {
        if (loginType === 'ADMIN') return isAdminLoginEmailValid ? null : 'Enter a valid admin email address.';
        return isUserLoginIdentifierValid ? null : 'Enter a valid email or username (min 3 characters).';
      }
      if (key === 'password') return password.trim().length > 0 ? null : 'Password is required.';
      return null;
    }

    if (key === 'fullName') return isFullNameValid ? null : 'Full name is required.';
    if (key === 'email') return isEmailValid ? null : 'Enter a valid email address.';
    if (key === 'username') {
      if (username.trim().length < 3) return 'Username must be at least 3 characters.';
      if (!patterns.username.test(username.trim())) return 'Use only letters, numbers, dot, underscore, or hyphen.';
      return null;
    }
    if (key === 'password') return isPasswordValid ? null : 'Password does not meet the required strength.';
    if (key === 'confirmPassword') return isConfirmPasswordValid ? null : 'Passwords must match.';
    if (key === 'adminApprovalCode') {
      if (!isAdminApprovalCodeRequired) return null;
      return adminApprovalCode.trim().length >= 6 ? null : 'Approval code must be at least 6 characters.';
    }
    if (key === 'acceptedTerms') return acceptedTerms ? null : 'You must accept the terms to continue.';
    return null;
  };

  const fieldOk = (key: string): boolean => {
    if (!touched[key]) return false;
    return fieldError(key) === null;
  };

  const inputBase =
    'w-full bg-white/5 border rounded-xl px-11 py-3.5 text-white placeholder-campus-lavender/50 focus:outline-none transition';
  const borderFor = (key: string) => {
    const err = fieldError(key);
    if (err) return 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/40';
    if (fieldOk(key)) return 'border-green-500/70 focus:border-green-400 focus:ring-1 focus:ring-green-400/30';
    return 'border-white/10 focus:border-campus-electric focus:ring-1 focus:ring-campus-electric/40';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-campus-dark/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          role="dialog"
          aria-modal="true"
          aria-describedby={descId}
          className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden bg-campus-navy/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 custom-scrollbar"
        >
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 text-campus-lavender hover:text-white transition"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-8 mt-2">
            <h2 className="text-3xl font-bold text-white mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p id={descId} className="text-campus-lavender text-sm">
              {mode === 'login' ? 'Enter your credentials to access the hub' : 'Join the most advanced campus operations ecosystem'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex bg-campus-dark/50 p-1 rounded-xl mb-8"
              >
                <button 
                  type="button"
                  onClick={() => setLoginType('USER')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition ${loginType === 'USER' ? 'bg-campus-electric text-white shadow-lg' : 'text-campus-lavender hover:text-white'}`}
                >
                  <UserIcon size={16} /> User Portal
                </button>
                <button 
                  type="button"
                  onClick={() => setLoginType('ADMIN')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition ${loginType === 'ADMIN' ? 'bg-campus-purple text-white shadow-lg' : 'text-campus-lavender hover:text-white'}`}
                >
                  <Shield size={16} /> Admin Portal
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-5">
            {(submitError || submitSuccess) && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  submitError
                    ? 'border-red-500/40 bg-red-500/10 text-red-200'
                    : 'border-green-500/30 bg-green-500/10 text-green-200'
                }`}
                role={submitError ? 'alert' : 'status'}
              >
                {submitError ?? submitSuccess}
              </div>
            )}

            {mode === 'signup' && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-5 overflow-hidden">
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-campus-lavender opacity-60" size={18} />
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => markTouched('fullName')}
                      aria-invalid={!!fieldError('fullName')}
                      className={`${inputBase} ${borderFor('fullName')}`}
                    />
                  </div>
                  {fieldError('fullName') && <p className="text-xs text-red-300 px-1 -mt-3">{fieldError('fullName')}</p>}

                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-campus-lavender opacity-60" size={18} />
                    <input 
                      type="text"
                      placeholder="Username (min 3 characters)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={() => markTouched('username')}
                      aria-invalid={!!fieldError('username')}
                      className={`${inputBase} ${borderFor('username')}`}
                    />
                  </div>
                  {fieldError('username') && <p className="text-xs text-red-300 px-1 -mt-3">{fieldError('username')}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-campus-lavender opacity-60" size={18} />
                      <select
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value as 'USER' | 'ADMIN')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3.5 text-white focus:outline-none focus:border-campus-electric focus:ring-1 focus:ring-campus-electric/40 transition"
                        aria-label="Role"
                      >
                        <option value="USER" className="bg-campus-dark">
                          User
                        </option>
                        <option value="ADMIN" className="bg-campus-dark">
                          Admin (restricted)
                        </option>
                      </select>
                    </div>

                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-campus-lavender opacity-60" size={18} />
                      <input
                        type="text"
                        placeholder={isAdminApprovalCodeRequired ? 'Approval Code (required)' : 'Approval Code (optional)'}
                        value={adminApprovalCode}
                        onChange={(e) => setAdminApprovalCode(e.target.value)}
                        onBlur={() => markTouched('adminApprovalCode')}
                        aria-invalid={!!fieldError('adminApprovalCode')}
                        className={`${inputBase} ${borderFor('adminApprovalCode')}`}
                        disabled={!isAdminApprovalCodeRequired}
                      />
                    </div>
                  </div>
                  {fieldError('adminApprovalCode') && (
                    <p className="text-xs text-red-300 px-1 -mt-3">{fieldError('adminApprovalCode')}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-campus-lavender opacity-60" size={18} />
                <input 
                  type={mode === 'login' ? 'text' : 'email'}
                  placeholder={mode === 'login' ? loginIdentifierPlaceholder : 'Email Address'}
                  value={mode === 'login' ? loginIdentifier : email}
                  onChange={(e) => (mode === 'login' ? setLoginIdentifier(e.target.value) : setEmail(e.target.value))}
                  onBlur={() => markTouched(mode === 'login' ? 'loginIdentifier' : 'email')}
                  aria-label={mode === 'login' ? loginIdentifierLabel : 'Email Address'}
                  aria-invalid={mode === 'login' ? !!fieldError('loginIdentifier') : !!fieldError('email')}
                  className={`${inputBase} ${borderFor(mode === 'login' ? 'loginIdentifier' : 'email')}`}
                />
              </div>
              {mode === 'login' && fieldError('loginIdentifier') && (
                <p className="text-xs text-red-300 px-1 mt-2">{fieldError('loginIdentifier')}</p>
              )}
              {mode === 'signup' && fieldError('email') && (
                <p className="text-xs text-red-300 px-1 mt-2">{fieldError('email')}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-campus-lavender opacity-60" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => markTouched('password')}
                  aria-invalid={!!fieldError('password')}
                  className={`${inputBase} ${borderFor('password')}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-campus-lavender opacity-60 hover:opacity-100">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {mode === 'login' && fieldError('password') && (
                <p className="text-xs text-red-300 px-1 mt-2">{fieldError('password')}</p>
              )}
              
              {mode === 'signup' && (
                 <div className="text-xs mt-2 space-y-1 px-1">
                    <p className={hasMinLen ? 'text-green-400' : 'text-campus-lavender/60'}>• 8+ characters</p>
                    <p className={hasUpper && hasLower ? 'text-green-400' : 'text-campus-lavender/60'}>• Upper & lowercase letters</p>
                    <p className={hasNum && hasSpecial ? 'text-green-400' : 'text-campus-lavender/60'}>• Number & special character</p>
                 </div>
              )}
            </div>

            {mode === 'signup' && (
             <AnimatePresence>
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                 <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-campus-lavender opacity-60" size={18} />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => markTouched('confirmPassword')}
                    aria-invalid={!!fieldError('confirmPassword')}
                    className={`${inputBase} ${borderFor('confirmPassword')}`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-campus-lavender opacity-60 hover:opacity-100">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldError('confirmPassword') && (
                  <p className="text-xs text-red-300 px-1 mt-2">{fieldError('confirmPassword')}</p>
                )}
              </motion.div>
             </AnimatePresence>
            )}

            {mode === 'login' && (
              <div className="flex justify-between items-center px-1">
                <label className="flex items-center text-sm text-campus-lavender gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 bg-transparent text-campus-electric focus:ring-0"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess('Password reset is not enabled in this demo build.')}
                  className="text-sm text-campus-electric hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {mode === 'signup' && (
              <div className="px-1">
                <label className="flex items-start gap-3 text-sm text-campus-lavender cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    onBlur={() => markTouched('acceptedTerms')}
                    className="mt-1 rounded border-white/20 bg-transparent text-campus-electric focus:ring-0"
                  />
                  <span>
                    I agree to the{' '}
                    <button type="button" className="text-campus-electric hover:underline">
                      Terms & Conditions
                    </button>{' '}
                    and acknowledge the platform usage policy.
                  </span>
                </label>
                {fieldError('acceptedTerms') && (
                  <p className="text-xs text-red-300 px-1 mt-2">{fieldError('acceptedTerms')}</p>
                )}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting || (mode === 'login' ? !isLoginValid : !isSignupValid)}
              className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-campus-electric to-campus-purple text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-campus-electric/30 transition-all duration-300"
            >
              {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-campus-lavender text-sm">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-white font-semibold hover:text-campus-electric transition"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default AuthModal;
