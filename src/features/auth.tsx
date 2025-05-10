import { Box, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField, Typography, InputLabel, Select, MenuItem } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../assets/styles/Owntheme";
import CustomButton from "../shared/components/Button/customButton";
import { PROJECT_NAME } from "../shared/constants/constants";
import { useAuthStore } from "../store/authStore";

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
    <Box className="w--full display-flex-center full-screen flex--column">
      <Typography
        component={"h1"}
        className="text--uppercase font-all-pro"
        sx={{
          letterSpacing: "3px",
          fontSize: "32px",
          color: colors.primary.main,
        }}
      >
        {PROJECT_NAME}
      </Typography>
      <Box className="bg--white w--full mt--15" sx={{ maxWidth: "380px", borderRadius: "10px", border: "2px solid #ECECEC" }}>
        <Box className="display-flex-center flex--column" sx={{ margin: "10px" }}>
          <Typography
            component={"h1"}
            className="font--semi-bold"
            sx={{
              fontSize: "24px",
              margin: "50px 0",
              color: colors.primary.main,
            }}
          >
            Authentication
          </Typography>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
            style={{ width: '100%' }}
            autoComplete="off"
          >
            <FormControl component="fieldset" sx={{ width: "30ch" }}>
              <RadioGroup
                value={authType}
                onChange={(e) => setAuthType(e.target.value as 'individual' | 'family')}
              >
                <FormControlLabel 
                  value="individual" 
                  control={<Radio />} 
                  label="Individual" 
                />
                <FormControlLabel 
                  value="family" 
                  control={<Radio />} 
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

            <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
              <FormHelperText
                id="pin-helper-text"
                className="m--0 font--medium"
                sx={{
                  color: colors.black.main,
                }}
              >
                Enter PIN
              </FormHelperText>
            
              <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'center', mt: 1 }}>
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
                        padding: "9px 15px",
                        textAlign: "center",
                        fontSize: "24px",
                        width: "40px",
                        height: "40px",
                      },
                    }}
                    error={Boolean(error)}
                    sx={{
                      width: "40px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
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
                margin: "30px 16px",
                gap: "5px",
                width: "30ch",
              }}
              className="flex flex--column align-items--end"
            >
              <CustomButton
                variant="contained"
                type="submit"
                size="large"
                style={{
                  borderRadius: "25px",
                  width: "100%",
                }}
                text="Authenticate"
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Auth; 