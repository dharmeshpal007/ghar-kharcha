import { Box, Typography, Card, Grid, Button, TextField, Chip, MenuItem, Select, InputLabel, FormControl, ToggleButton, ToggleButtonGroup, Divider, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, LinearProgress, Avatar, TablePagination, Tooltip, styled } from "@mui/material";
import { useState, useEffect } from "react";
import { Add, Repeat, MonetizationOn, PieChart, EmojiEmotions, Flag, ArrowDownward, ArrowUpward, Delete, Edit, Star, Info } from "@mui/icons-material";
import { addExpense, Expense, listenExpenses, deleteExpense, updateExpense } from "../services/firebase";
import { SelectChangeEvent } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useAuthStore } from "../store/authStore";

const initialCategories = [
  { label: "Salary" },
  { label: "Food" },
  { label: "Travel" },
  { label: "Home" },
  { label: "More" },
];

const moods = [
  { label: "Happy", icon: "😊" },
  { label: "Stressed", icon: "😰" },
  { label: "Neutral", icon: "😐" },
  { label: "Regretful", icon: "😅" },
  { label: "Satisfied", icon: "😎" },
  { label: "Impulsive", icon: "🤯" },
];

const users = ["Me", "Mom", "Dad", "Sister"];
const goals = ["Trip to Goa", "New Phone", "Emergency Fund"];

// Add mood categories after the moods array
const goodMoods = ["Happy", "Neutral", "Satisfied"];

// Helper to get start of week (Monday)
function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Helper to format date as 'YYYY-MM-DD'
function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Days of week labels
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Add styled tooltip component after imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#333',
    maxWidth: 300,
    fontSize: '0.875rem',
    border: '1px solid #ddd',
    padding: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    borderRadius: '8px',
  },
}));

const Dashboard = () => {
  // Add greeting function
  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour >= 5 && hour < 12) {
      greeting = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      greeting = 'Good Evening';
    } else {
      greeting = 'Good Night';
    }

    return `${greeting}, ${authType === 'family' ? 'Family!' : currentUser}!`;
  };

  // Entry form state
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState(initialCategories);
  const [category, setCategory] = useState(initialCategories[0].label);
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [user, setUser] = useState(users[0]);
  const [recurring, setRecurring] = useState(false);
  const [goal, setGoal] = useState("");
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week' | 'year' | 'yesterday'>('month');
  // New category dialog state
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  // Chart toggle state
  const [chartMode, setChartMode] = useState<'date' | 'mood' | 'category'>('date');
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Sorting state
  const [sortBy, setSortBy] = useState<'date' | null>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // Transaction type state
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  // Edit state
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  // Add tooltip state
  const [tooltipOpen, setTooltipOpen] = useState(false);
  // Add date state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const authType = useAuthStore(state => state.authType);
  const currentUser = useAuthStore(state => state.currentUser);

  useEffect(() => {
    const unsubscribe = listenExpenses((data) => {
      setExpenses(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authType === 'individual' && currentUser) {
      setUser(currentUser);
    }
  }, [authType, currentUser]);

  useEffect(() => {
    if (transactionType === 'income') {
      setCategory('Salary');
    } else if (transactionType === 'expense') {
      setCategory(initialCategories[1].label); // Default to first expense category
    }
  }, [transactionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      date: selectedDate || new Date().toISOString().slice(0, 10), // Use selected date or default to today
      amount: Number(amount),
      category,
      mood: moods.find(m => m.label === mood)?.icon || "",
      notes,
      user,
      recurring,
      goal,
      type: transactionType,
    };
    try {
      if (editExpense && editExpense.key) {
        await updateExpense(editExpense.key, {
          ...newExpense,
          date: editExpense.date // preserve original date when editing
        });
      } else {
        await addExpense(newExpense);
      }
    } catch {
      alert("Failed to save expense to Firebase");
    }
    setAmount("");
    setCategory(initialCategories[0].label);
    setMood("");
    setNotes("");
    setUser(users[0]);
    setRecurring(false);
    setGoal("");
    setTransactionType('expense');
    setSelectedDate(new Date().toISOString().slice(0, 10)); // Reset date to today
    setEditExpense(null);
    setOpen(false);
  };

  // When editing, prefill form
  useEffect(() => {
    if (editExpense) {
      setAmount(editExpense.amount.toString());
      setCategory(editExpense.category);
      setMood(moods.find(m => m.icon === editExpense.mood)?.label || "");
      setNotes(editExpense.notes);
      setUser(editExpense.user);
      setRecurring(editExpense.recurring);
      setGoal(editExpense.goal);
      setTransactionType(editExpense.type);
      setSelectedDate(editExpense.date); // Set the date from the expense being edited
      setOpen(true);
    }
  }, [editExpense]);

  // Filtering and sorting logic
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  // Helper to get yesterday's date in YYYY-MM-DD format
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // Weekly date strings for the current week
  const startOfWeekDate = getStartOfWeek(new Date());
  const weekDates: string[] = weekDays.map((_, idx) => {
    const dayDate = new Date(startOfWeekDate);
    dayDate.setDate(startOfWeekDate.getDate() + idx);
    return formatDate(dayDate);
  });

  // Filter expenses based on time filter
  const filteredExpenses = (authType === 'individual' && currentUser
    ? expenses.filter(e => e.user === currentUser)
    : expenses
  ).filter(exp => {
    if (timeFilter === 'all') return true;
    if (timeFilter === 'yesterday') return exp.date === yesterdayStr;
    const expDate = new Date(exp.date);
    if (timeFilter === 'month') return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    if (timeFilter === 'week') return weekDates.includes(exp.date);
    if (timeFilter === 'year') return expDate.getFullYear() === now.getFullYear();
    return true;
  });

  // Sort expenses based on sortBy and sortOrder
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
    }
    return 0;
  });

  // Paginated expenses
  const paginatedExpenses = sortedExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Weekly bar chart data (by date)
  const weekChartData = weekDays.map((label, idx) => {
    const dayDate = new Date(startOfWeekDate);
    dayDate.setDate(startOfWeekDate.getDate() + idx);
    const dayStr = formatDate(dayDate);
    const total = filteredExpenses.filter(e => e.date === dayStr && e.type === 'expense').reduce((sum, e) => sum + (e.amount || 0), 0);
    return { day: label, total };
  });

  // Weekly bar chart data (by mood)
  const weekMoods = filteredExpenses.filter(e => weekDates.includes(e.date) && e.mood && e.type === 'expense');
  const moodTotals: Record<string, number> = {};
  weekMoods.forEach(e => {
    if (e.mood) moodTotals[e.mood] = (moodTotals[e.mood] || 0) + (e.amount || 0);
  });
  const moodChartData = Object.entries(moodTotals).map(([mood, total]) => ({ mood, total }));

  // Helper to get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Calculate today's spend from expenses (only expenses, not salary)
  const todaySpend = filteredExpenses
    .filter(e => e.date === todayStr && e.type === 'expense')
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  // Calculate today's mood summary and mode
  const todayMoods = filteredExpenses.filter(e => e.date === todayStr && e.mood);
  const moodSummary: Record<string, number> = {};
  todayMoods.forEach(e => {
    if (e.mood) moodSummary[e.mood] = (moodSummary[e.mood] || 0) + 1;
  });
  let modeMood = '';
  let maxCount = 0;
  Object.entries(moodSummary).forEach(([mood, count]) => {
    if (count > maxCount) {
      modeMood = mood;
      maxCount = count;
    }
  });

  // Weekly bar chart data (by category)
  // Get unique categories from the data
  const uniqueCategories = Array.from(new Set(
    filteredExpenses
      .filter(e => weekDates.includes(e.date) && e.type === 'expense')
      .map(e => e.category)
  )).filter(Boolean); // Remove any null/undefined categories

  const categoryChartData = uniqueCategories.map(category => {
    const total = filteredExpenses
      .filter(e => weekDates.includes(e.date) && e.category === category && e.type === 'expense')
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    return { category, total };
  }).filter(data => data.total > 0); // Only show categories with expenses

  // Helper: is date in current month?
  function isThisMonth(dateStr: string) {
    const d = new Date(dateStr);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }

  // Calculate total salary (income) for current month
  const totalSalary = filteredExpenses
    .filter(e => e.type === 'income' && e.category === 'Salary' && isThisMonth(e.date))
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  // Calculate total expenses for current month
  const totalExpenses = filteredExpenses
    .filter(e => e.type === 'expense' && isThisMonth(e.date))
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  // Budget used progress (current month)
  const budgetUsed = totalSalary > 0 ? totalExpenses / totalSalary : 0;
  const remainingSalary = totalSalary - totalExpenses;
  const isOverBudget = totalExpenses > totalSalary;

  // Add click handler for tooltip
  const handleTooltipClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setTooltipOpen(!tooltipOpen);
  };

  // Add click handler to close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setTooltipOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Greeting */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1.5rem', sm: '2rem' },
          color: '#3183FF',
          mb: 2,
          textAlign: 'center'
        }}
      >
        {getGreeting()}
      </Typography>

      {/* Slogan */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.1rem', sm: '1.5rem' },
            background: 'linear-gradient(90deg, #3183FF 0%, #43a047 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.5
          }}
        >
          <span role="img" aria-label="wallet" style={{ marginRight: 8 }}>👛</span>
          Manage, Share, and Control Your Finances — Anytime, Anywhere
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ fontWeight: 500, color: '#43a047', fontSize: { xs: '0.85rem', sm: '1rem' } }}
        >
          Empowering your family's financial journey!
        </Typography>
      </Box>

      {/* USP Mood Analysis Message */}
      {(() => {
        
        // Calculate total expenses for today
        const totalTodayExpense = filteredExpenses.filter(e => e.date === todayStr && e.type === 'expense').reduce((sum, e) => sum + (e.amount || 0), 0);
        // Calculate total expenses for each mood for today
        const moodExpenseTotals: Record<string, number> = {};
        filteredExpenses.filter(e => e.date === todayStr && e.type === 'expense' && e.mood).forEach(e => {
          moodExpenseTotals[e.mood] = (moodExpenseTotals[e.mood] || 0) + (e.amount || 0);
        });
        // Find the mood with the highest expense
        let topMood = '';
        let topAmount = 0;
        Object.entries(moodExpenseTotals).forEach(([mood, amount]) => {
          if (amount > topAmount) {
            topMood = mood;
            topAmount = amount;
          }
        });
        if (topMood && totalTodayExpense > 0) {
          // Find mood label for the emoji
          const moodLabel = moods.find(m => m.icon === topMood)?.label || topMood;
          const percent = Math.round((topAmount / totalTodayExpense) * 100);
          const isGoodMood = goodMoods.includes(moodLabel);
          
          return (
            <Card sx={{
              mb: 3,
              p: 2,
              bgcolor: isGoodMood ? '#e8f5e9' : '#ffebee',
              border: `2px solid ${isGoodMood ? '#81c784' : '#e57373'}`,
              boxShadow: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              justifyContent: 'center',
              position: 'relative',
            }}>
              <Star sx={{ color: isGoodMood ? '#43a047' : '#e53935', fontSize: 36, mr: 1 }} />
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#333', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                  Today you have spent {percent}% of expenses while you are in {moodLabel.toLowerCase()}.
                </Typography>
              </Box>
              <StyledTooltip 
                title={
                  isGoodMood 
                    ? (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#43a047', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span role="img" aria-label="star">⭐</span> Great Spending Habits!
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          You're making mindful spending decisions! This positive mood helps you make better financial choices. Keep up the good work! 🎯
                        </Typography>
                      </Box>
                    )
                    : (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#e53935', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span role="img" aria-label="lightbulb">💡</span> Smart Spending Tips
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          When feeling {moodLabel.toLowerCase()}, try these strategies:
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2, color: '#666' }}>
                          <Typography component="li" variant="body2">Take a 24-hour pause before purchases ⏰</Typography>
                          <Typography component="li" variant="body2">Set aside a small budget for impulse buys 💰</Typography>
                          <Typography component="li" variant="body2">Practice stress-relief activities 🧘‍♂️</Typography>
                          <Typography component="li" variant="body2">Track your spending triggers 📝</Typography>
                        </Box>
                      </Box>
                    )
                }
                arrow
                placement="bottom"
                open={tooltipOpen}
                onClose={() => setTooltipOpen(false)}
              >
                <Info 
                  onClick={handleTooltipClick}
                  sx={{ 
                    color: isGoodMood ? '#43a047' : '#e53935',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.2)'
                    }
                  }} 
                />
              </StyledTooltip>
            </Card>
          );
        }
        return null;
      })()}

      {/* Greeting & Snapshots */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        {getGreeting()}
      </Typography>
      <Grid container spacing={{ xs: 4, sm: 2 }} sx={{ mb: { xs: 3, sm: 6 } }}>
        {/* Today's Spend */}
        <Grid item xs={12} sm={3}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 3, 
            boxShadow: 1, 
            bgcolor: '#e3f2fd', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            p: { xs: 1, sm: 2 }
          }}>
            <Avatar sx={{ bgcolor: '#3183FF', mb: 1, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}><MonetizationOn /></Avatar>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Today's Spend</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>₹{todaySpend}</Typography>
          </Card>
        </Grid>
        {/* Budget Used */}
        <Grid item xs={12} sm={3}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 3, 
            boxShadow: 1, 
            bgcolor: '#fff3e0', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            p: { xs: 1, sm: 2 }
          }}>
            <Avatar sx={{ bgcolor: '#ff9800', mb: 1, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}><PieChart /></Avatar>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Budget Used (This Month)</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>Total Salary: ₹{totalSalary}</Typography>
            <Typography variant="caption" color={isOverBudget ? 'error.main' : 'text.secondary'} sx={{ mt: 0.5, fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
              Remaining: ₹{remainingSalary >= 0 ? remainingSalary : 0}
            </Typography>
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={budgetUsed * 100}
                sx={{
                  height: { xs: 6, sm: 8 },
                  borderRadius: 5,
                  bgcolor: '#ffe0b2',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: isOverBudget ? '#e53935' : '#ff9800',
                  },
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }} color={isOverBudget ? 'error.main' : undefined}>
              {Math.round(budgetUsed * 100)}%
            </Typography>
            {isOverBudget && (
              <Typography variant="caption" color="error.main" sx={{ mt: 1, fontWeight: 600, fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                Over budget!
              </Typography>
            )}
          </Card>
        </Grid>
        {/* Mood Tags */}
        <Grid item xs={12} sm={3}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 3, 
            boxShadow: 1, 
            bgcolor: '#e8f5e9', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            p: { xs: 1, sm: 2 }
          }}>
            <Avatar sx={{ 
              bgcolor: '#43a047', 
              mb: 1, 
              width: { xs: 32, sm: 48 }, 
              height: { xs: 32, sm: 48 }, 
              fontSize: { xs: 24, sm: 32 } 
            }}>{modeMood || <EmojiEmotions />}</Avatar>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Mood Tags</Typography>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
              {moods.map(m => (
                <Tooltip key={m.label} title={m.label} arrow>
                  <span>
                    <Chip
                      label={`${m.icon} x${moodSummary[m.icon] || 0}`}
                      size="small"
                      sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}
                    />
                  </span>
                </Tooltip>
              ))}
            </Box>
          </Card>
        </Grid>
        {/* Goal Tracker */}
        <Grid item xs={12} sm={3}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 3, 
            boxShadow: 1, 
            bgcolor: '#fce4ec', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            p: { xs: 1, sm: 2 }, 
            justifyContent: 'center' 
          }}>
            <Avatar sx={{ bgcolor: '#e91e63', mb: 1, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}><Flag /></Avatar>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Goal Tracker</Typography>
            <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 40 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '1rem' } }}>
                Coming soon...
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Expense Table Controls */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2, 
        flexWrap: 'wrap', 
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ 
            fontWeight: 600, 
            fontSize: { xs: 16, sm: 18 }, 
            minWidth: { xs: '100%', sm: 160 },
            mb: { xs: 1, sm: 0 }
          }}
          onClick={() => { setEditExpense(null); setOpen(true); }}
        >
          Add Transaction
        </Button>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
          <InputLabel>Time Filter</InputLabel>
          <Select
            value={timeFilter}
            label="Time Filter"
            onChange={(e: SelectChangeEvent<string>) => setTimeFilter(e.target.value as 'all' | 'month' | 'week' | 'year' | 'yesterday')}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Expense Table with Pagination and Fixed Height */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          mb: 2, 
          maxHeight: { xs: 300, sm: 350 }, 
          minHeight: { xs: 300, sm: 350 }, 
          overflowX: 'auto',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: '0 4px',
          }
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                onClick={() => {
                  if (sortBy === 'date') setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                  setSortBy('date');
                }} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  fontWeight: 600,
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  '&:hover': {
                    backgroundColor: '#e9ecef',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Date
                  {sortBy === 'date' && (sortOrder === 'desc' ? <ArrowDownward fontSize="small" /> : <ArrowUpward fontSize="small" />)}
                </Box>
              </TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                fontWeight: 600,
                backgroundColor: '#f8f9fa',
                color: '#333'
              }}>Amount</TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                fontWeight: 600,
                backgroundColor: '#f8f9fa',
                color: '#333'
              }}>Category</TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                fontWeight: 600,
                backgroundColor: '#f8f9fa',
                color: '#333'
              }}>Mood</TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                fontWeight: 600,
                backgroundColor: '#f8f9fa',
                color: '#333'
              }}>Member</TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                fontWeight: 600,
                backgroundColor: '#f8f9fa',
                color: '#333'
              }}>Recurring</TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                fontWeight: 600,
                backgroundColor: '#f8f9fa',
                color: '#333'
              }}>Goal</TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                fontWeight: 600,
                backgroundColor: '#f8f9fa',
                color: '#333'
              }}>Notes</TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                fontWeight: 600,
                backgroundColor: '#f8f9fa',
                color: '#333'
              }}></TableCell>
              <TableCell sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                fontWeight: 600,
                backgroundColor: '#f8f9fa',
                color: '#333'
              }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : paginatedExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4, color: '#666' }}>
                  No expenses found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedExpenses.map((exp, idx) => (
                <TableRow 
                  key={idx}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      '& .MuiTableCell-root': {
                        borderBottom: '1px solid #e9ecef',
                      }
                    },
                    transition: 'background-color 0.2s',
                    '& .MuiTableCell-root': {
                      borderBottom: '1px solid #f0f0f0',
                      py: 1.5
                    }
                  }}
                >
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: '#495057',
                    fontWeight: 500
                  }}>{exp.date || '-'}</TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: exp.type === 'expense' ? '#dc3545' : '#28a745',
                    fontWeight: 600
                  }}>₹{exp.amount || '-'}</TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: '#495057'
                  }}>
                    <Chip 
                      label={exp.category || '-'} 
                      size="small" 
                      sx={{ 
                        backgroundColor: exp.category === 'Salary' ? '#d4edda' : '#cce5ff',
                        color: exp.category === 'Salary' ? '#155724' : '#004085',
                        fontWeight: 500,
                        fontSize: { xs: '0.6rem', sm: '0.75rem' }
                      }} 
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: '#495057'
                  }}>{exp.mood || '-'}</TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: '#495057'
                  }}>{exp.user || '-'}</TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: '#495057'
                  }}>
                    {exp.recurring ? (
                      <Chip 
                        label="Yes" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#fff3cd',
                          color: '#856404',
                          fontWeight: 500,
                          fontSize: { xs: '0.6rem', sm: '0.75rem' }
                        }} 
                      />
                    ) : (
                      <Chip 
                        label="No" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          color: '#6c757d',
                          fontWeight: 500,
                          fontSize: { xs: '0.6rem', sm: '0.75rem' }
                        }} 
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: '#495057'
                  }}>{exp.goal || '-'}</TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: '#495057',
                    maxWidth: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>{exp.notes || '-'}</TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: '#495057'
                  }}>
                    <Edit
                      color="primary"
                      sx={{ 
                        cursor: 'pointer', 
                        mr: 1,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.2)'
                        }
                      }}
                      onClick={() => setEditExpense(exp)}
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    color: '#495057'
                  }}>
                    <Delete 
                      color="error" 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.2)'
                        }
                      }}
                      onClick={async () => {
                        if (window.confirm('Delete this transaction?')) {
                          if (exp.key) {
                            await deleteExpense(exp.key);
                          }
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={sortedExpenses.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25]}
        sx={{ 
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.7rem', sm: '0.875rem' }
          }
        }}
      />

      {/* Chart Toggle */}
      <Box sx={{ width: '100%', mb: 1, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={chartMode}
          exclusive
          onChange={(_, val) => val && setChartMode(val)}
          size="small"
          sx={{ 
            '& .MuiToggleButton-root': {
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }
          }}
        >
          <ToggleButton value="date">By Date</ToggleButton>
          <ToggleButton value="mood">By Mood</ToggleButton>
          <ToggleButton value="category">By Category</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Bar Chart */}
      <Box sx={{ width: '100%', height: { xs: 200, sm: 250 }, mb: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'date' ? (
            <BarChart data={weekChartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `₹${v}`} tick={{ fontSize: 10 }} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="total" fill="#3183FF" name="Total Spend" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : chartMode === 'mood' ? (
            <BarChart data={moodChartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mood" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `₹${v}`} tick={{ fontSize: 10 }} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="total" fill="#43a047" name="Total Spend" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={categoryChartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `₹${v}`} tick={{ fontSize: 10 }} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="total" fill="#ff9800" name="Total Spend" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>

      {/* Entry Form Dialog */}
      <Dialog 
        open={open} 
        onClose={() => { setOpen(false); setEditExpense(null); }} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Add Transaction</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box component="form" id="entry-form" onSubmit={handleSubmit} autoComplete="off" sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <ToggleButtonGroup
                  value={transactionType}
                  exclusive
                  onChange={(_, val) => val && setTransactionType(val)}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="expense" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Expense</ToggleButton>
                  <ToggleButton value="income" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Income</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item>
                <TextField
                  label="Amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                  fullWidth
                  autoFocus
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                    sx: { fontSize: { xs: '1.1rem', sm: '1.5rem' } }
                  }}
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Date (optional)"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: new Date().toISOString().slice(0, 10), // Set minimum date to today
                  }}

                  sx={{ 
                    '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '0.875rem' } },
                    '& .MuiInputBase-input': { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
                  }}
                />

              </Grid>
              <Grid item>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Category</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {categories
                    .filter((cat: {label: string}) => transactionType === 'income' ? cat.label === 'Salary' : cat.label !== 'Salary')
                    .map((cat: {label: string}) =>
                      cat.label === "More" ? (
                        <Chip
                          key={cat.label}
                          label={cat.label}
                          color="default"
                          onClick={() => setOpenCategoryDialog(true)}
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '1rem' }, 
                            p: { xs: 0.5, sm: 1 }, 
                            mb: 1, 
                            borderStyle: 'dashed' 
                          }}
                        />
                      ) : (
                        <Chip
                          key={cat.label}
                          label={cat.label}
                          color={category === cat.label ? "primary" : "default"}
                          onClick={() => setCategory(cat.label)}
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '1rem' }, 
                            p: { xs: 0.5, sm: 1 }, 
                            mb: 1 
                          }}
                        />
                      )
                    )}
                </Box>
              </Grid>
              {transactionType === 'expense' && (
                <Grid item>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    How do you feel about this expense?
                  </Typography>
                  <Grid container spacing={2}>
                    {moods.map(m => (
                      <Grid item xs={4} sm={4} md={4} key={m.label}>
                        <Button
                          variant={mood === m.label ? "contained" : "outlined"}
                          color={mood === m.label ? "primary" : "inherit"}
                          onClick={() => setMood(m.label)}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            py: 2,
                            borderRadius: 2,
                            borderColor: mood === m.label ? 'primary.main' : 'grey.300',
                            fontWeight: mood === m.label ? 700 : 400,
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            minHeight: 80
                          }}
                        >
                          <span style={{ fontSize: 28 }}>{m.icon}</span>
                          <span style={{ fontSize: 14, marginTop: 4 }}>{m.label}</span>
                        </Button>
                      </Grid>
                    ))}
                    {/* Fill empty cells if moods.length < 9 for 3x3 grid */}
                    {Array.from({ length: 9 - moods.length }).map((_, idx) => (
                      <Grid item xs={4} sm={4} md={4} key={`empty-${idx}`}></Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
              {transactionType === 'expense' && (
                <Grid item>
                  <TextField
                    label="Notes (optional)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    fullWidth
                    sx={{ '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '0.875rem' } } }}
                  />
                </Grid>
              )}
              {transactionType === 'expense' && (
                <Grid item>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Assign to</InputLabel>
                    <Select
                      value={user}
                      label="Assign to"
                      onChange={e => setUser(e.target.value)}
                      disabled={authType === 'individual'}
                      sx={{ '& .MuiSelect-select': { fontSize: { xs: '0.8rem', sm: '0.875rem' } } }}
                    >
                      {authType === 'family'
                        ? users.map(u => (
                            <MenuItem key={u} value={u} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{u}</MenuItem>
                          ))
                        : currentUser && <MenuItem value={currentUser} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{currentUser}</MenuItem>
                      }
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {transactionType === 'expense' && (
                <Grid item>
                  <ToggleButtonGroup
                    value={recurring ? "recurring" : "one-time"}
                    exclusive
                    onChange={(_, val) => setRecurring(val === "recurring")}
                    fullWidth
                    sx={{ width: '100%' }}
                  >
                    <ToggleButton value="one-time" sx={{ width: '50%', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>One-time</ToggleButton>
                    <ToggleButton value="recurring" sx={{ width: '50%', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      <Repeat fontSize="small" sx={{ mr: 0.5 }} />Recurring
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              )}
              {transactionType === 'expense' && (
                <Grid item>
                  <FormControl fullWidth>
                    <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Goal (optional)</InputLabel>
                    <Select 
                      value={goal} 
                      label="Goal (optional)" 
                      onChange={e => setGoal(e.target.value)}
                      sx={{ '& .MuiSelect-select': { fontSize: { xs: '0.8rem', sm: '0.875rem' } } }}
                    >
                      <MenuItem value="" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>None</MenuItem>
                      {goals.map(g => (
                        <MenuItem key={g} value={g} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{g}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    size="large" 
                    startIcon={<Add />} 
                    sx={{ 
                      mb: 0,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      flex: 1
                    }}
                  >
                    Save
                  </Button>
                  <Button 
                    onClick={() => setOpen(false)} 
                    color="secondary" 
                    fullWidth 
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, flex: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      <Divider sx={{ my: 2 }} />
      {/* Placeholder for recent transactions, etc. */}
      <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
        Recent transactions and analytics coming soon...
      </Typography>

      {/* New Category Dialog */}
      <Dialog 
        open={openCategoryDialog} 
        onClose={() => setOpenCategoryDialog(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Add New Category</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Category Name"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="e.g. Pizza"
              fullWidth
              sx={{ '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '0.875rem' } } }}
            />
          </Box>
        </DialogContent>
        <Box sx={{ display: 'flex', gap: 2, p: 2, pt: 0 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!newCategoryName.trim()}
            onClick={() => {
              setCategories([
                ...categories.slice(0, -1),
                { label: newCategoryName.trim() },
                categories[categories.length - 1], // keep More at end
              ]);
              setCategory(newCategoryName.trim());
              setNewCategoryName("");
              setOpenCategoryDialog(false);
            }}
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => {
              setOpenCategoryDialog(false);
              setNewCategoryName("");
            }}
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Cancel
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
