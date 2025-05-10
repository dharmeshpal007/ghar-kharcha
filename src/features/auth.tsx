import { Box, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField, Typography, InputLabel, Select, MenuItem } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../shared/components/Button/customButton";
import { PROJECT_NAME } from "../shared/constants/constants";
import { useAuthStore } from "../store/authStore";
import LockIcon from '@mui/icons-material/Lock';

const Auth = () => {
  const [authType, setAuthType] = useState<'individual' | 'family'>('individual');
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const users = ["Me", "Mom", "Dad", "Sister"];
  const [selectedUser, setSelectedUser] = useState(users[0]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      setError('');

      // Auto-focus next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const correctPin = authType === 'individual' ? '0000' : '1234';
    
    const pinString = pin.join('');
    if (pinString === correctPin) {
      if (authType === 'individual') {
        setAuth(authType, selectedUser);
      } else {
        setAuth(authType);
      }
      navigate('/dashboard');
    } else {
      setError('Invalid PIN');
    }
  };

  return (
    <Box className="w--full display-flex-center full-screen flex--column" sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f0ff 0%, #fceabb 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      p: { xs: 1, sm: 2 }
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        mb: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 2 }
      }}>
        <LockIcon sx={{ 
          fontSize: { xs: 40, sm: 56 }, 
          color: '#3183FF', 
          mb: 1, 
          boxShadow: 3, 
          bgcolor: 'white', 
          borderRadius: '50%', 
          p: { xs: 0.5, sm: 1 } 
        }} />
        <Typography
          component={"h1"}
          className="text--uppercase font-all-pro"
          sx={{
            letterSpacing: { xs: "2px", sm: "3px" },
            fontSize: { xs: '1.5rem', sm: '2.5rem' },
            color: '#3183FF',
            fontWeight: 800,
            mb: 1,
            textAlign: 'center'
          }}
        >
          {PROJECT_NAME}
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ 
            fontWeight: 500, 
            color: '#43a047', 
            fontSize: { xs: '0.875rem', sm: '1.1rem' }, 
            mb: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 0 }
          }}
        >
          Welcome back! Securely manage your family's finances.
        </Typography>
      </Box>
      <Box className="bg--white w--full mt--15" sx={{ 
        maxWidth: { xs: "100%", sm: "380px" }, 
        width: { xs: "100%", sm: "auto" },
        borderRadius: "18px", 
        border: "2px solid #ECECEC", 
        boxShadow: 4, 
        p: { xs: 2, sm: 3 },
        mx: { xs: 1, sm: 2 }
      }}>
        <Box className="display-flex-center flex--column" sx={{ margin: { xs: "5px", sm: "10px" } }}>
          <Typography
            component={"h1"}
            className="font--semi-bold"
            sx={{
              fontSize: { xs: "20px", sm: "24px" },
              margin: { xs: "20px 0 16px 0", sm: "32px 0 24px 0" },
              color: '#3183FF',
              fontWeight: 700
            }}
          >
            Sign In
          </Typography>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
            style={{ width: '100%' }}
            autoComplete="off"
          >
            <FormControl component="fieldset" sx={{ width: "100%", mb: 2 }}>
              <RadioGroup
                value={authType}
                onChange={(e) => setAuthType(e.target.value as 'individual' | 'family')}
                row
                sx={{ justifyContent: 'center' }}
              >
                <FormControlLabel 
                  value="individual" 
                  control={<Radio sx={{ color: '#3183FF' }} />} 
                  label="Individual" 
                />
                <FormControlLabel 
                  value="family" 
                  control={<Radio sx={{ color: '#3183FF' }} />} 
                  label="Family" 
                />
              </RadioGroup>
            </FormControl>

            {authType === 'individual' && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>User</InputLabel>
                <Select value={selectedUser} label="User" onChange={e => setSelectedUser(e.target.value)}>
                  {users.map(u => (
                    <MenuItem key={u} value={u}>{u}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
              <FormHelperText
                id="pin-helper-text"
                className="m--0 font--medium"
                sx={{
                  color: '#888',
                  fontWeight: 600,
                  fontSize: '1rem',
                  mb: 1
                }}
              >
                Enter 4-digit PIN
              </FormHelperText>
              <Box sx={{ display: 'flex', gap: { xs: '8px', sm: '16px' }, justifyContent: 'center', mt: 1 }}>
                {[0, 1, 2, 3].map((index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={pin[index]}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    type="password"
                    inputProps={{
                      maxLength: 1,
                      style: {
                        padding: "8px 0",
                        textAlign: "center",
                        fontSize: "24px",
                        width: "40px",
                        height: "40px",
                        background: '#f5faff',
                        borderRadius: '12px',
                        // border: '1.5px solid #3183FF',
                        transition: 'box-shadow 0.2s',
                      },
                    }}
                    error={Boolean(error)}
                    sx={{
                      width: { xs: "40px", sm: "48px" },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: "12px",
                        boxShadow: 1,
                        '&:hover': {
                          boxShadow: 3,
                        },
                      },
                    }}
                  />
                ))}
              </Box>
              {error && (
                <FormHelperText error sx={{ textAlign: 'center', mt: 1 }}>
                  {error}
                </FormHelperText>
              )}
            </FormControl>

            <Box
              sx={{
                margin: "30px 0 0 0",
                gap: "5px",
                width: "100%",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <CustomButton
                variant="contained"
                type="submit"
                size="large"
                style={{
                  borderRadius: "25px",
                  width: "100%",
                  background: 'linear-gradient(90deg, #3183FF 0%, #43a047 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 4px 16px 0 rgba(49,131,255,0.10)',
                  transition: 'transform 0.15s',
                  padding: '8px 16px'
                }}
                text="Authenticate"
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Auth; 