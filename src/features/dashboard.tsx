import { Box, Typography, Card, Grid, Button, TextField, Chip, MenuItem, Select, InputLabel, FormControl, ToggleButton, ToggleButtonGroup, Divider, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, LinearProgress, Avatar, TablePagination } from "@mui/material";
import { useState, useEffect } from "react";
import { Add, Repeat, MonetizationOn, PieChart, EmojiEmotions, Flag, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { addExpense, Expense, listenExpenses } from "../services/firebase";
import { SelectChangeEvent } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
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

const Dashboard = () => {
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
      date: new Date().toISOString().slice(0, 10),
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
      await addExpense(newExpense);
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
    setOpen(false);
  };

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
    const total = filteredExpenses.filter(e => e.date === dayStr).reduce((sum, e) => sum + (e.amount || 0), 0);
    return { day: label, total };
  });

  // Weekly bar chart data (by mood)
  const weekMoods = filteredExpenses.filter(e => weekDates.includes(e.date) && e.mood);
  const moodTotals: Record<string, number> = {};
  weekMoods.forEach(e => {
    if (e.mood) moodTotals[e.mood] = (moodTotals[e.mood] || 0) + (e.amount || 0);
  });
  const moodChartData = Object.entries(moodTotals).map(([mood, total]) => ({ mood, total }));

  // Calculate today's spend from expenses
  const todaySpend = filteredExpenses
    .filter(e => e.date === yesterdayStr)
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  // Calculate today's mood summary and mode
  const todayMoods = filteredExpenses.filter(e => e.date === yesterdayStr && e.mood);
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
  const weekCategories = categories.filter(cat => cat.label !== 'More');
  const categoryChartData = weekCategories.map(cat => {
    const total = filteredExpenses
      .filter(e => weekDates.includes(e.date) && e.category === cat.label)
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    return { category: cat.label, total };
  });

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

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Slogan */}
      <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600, color: "#3183FF", mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
        Manage, Share, and Control Your Finances — Anytime, Anywhere
      </Typography>

      {/* Greeting & Snapshots */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Good Morning, Family!
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
              {Object.entries(moodSummary).length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>No moods today</Typography>
              ) : (
                Object.entries(moodSummary).map(([icon, count]) => (
                  <Chip 
                    key={icon} 
                    label={`${icon} x${count}`} 
                    size="small" 
                    sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}
                  />
                ))
              )}
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
          onClick={() => setOpen(true)}
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
          overflowX: 'auto'
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
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Date
                  {sortBy === 'date' && (sortOrder === 'desc' ? <ArrowDownward fontSize="small" /> : <ArrowUpward fontSize="small" />)}
                </Box>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Amount</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Category</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Mood</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Member</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Recurring</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Goal</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : paginatedExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No expenses found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedExpenses.map((exp, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{exp.date || '-'}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>₹{exp.amount || '-'}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{exp.category || '-'}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{exp.mood || '-'}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{exp.user || '-'}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{exp.recurring ? "Yes" : "No"}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{exp.goal || '-'}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{exp.notes || '-'}</TableCell>
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
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3183FF" name="Total Spend" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : chartMode === 'mood' ? (
            <BarChart data={moodChartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mood" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `₹${v}`} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#43a047" name="Total Spend" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={categoryChartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={v => `₹${v}`} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#ff9800" name="Total Spend" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>

      {/* Entry Form Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
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
