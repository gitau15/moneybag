const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MoneyBag Backend API' });
});

// Get user transactions
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ transactions: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { user_id, date, type, category, amount, note } = req.body;
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id,
          date,
          type,
          category,
          amount,
          note
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ transaction: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
app.put('/api/transactions/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { date, type, category, amount, note } = req.body;
    
    const { data, error } = await supabase
      .from('transactions')
      .update({
        date,
        type,
        category,
        amount,
        note
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ transaction: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
app.delete('/api/transactions/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user goals
app.get('/api/goals/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('custom_goals')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      // If no goals found, return empty array
      if (error.code === 'PGRST116') {
        return res.json({ 
          goals: { customGoals: [] }
        });
      }
      return res.status(400).json({ error: error.message });
    }

    // Transform the data to match the frontend structure
    const customGoals = data.map(goal => ({
      id: goal.id,
      name: goal.name,
      current: parseFloat(goal.current) || 0,
      target: parseFloat(goal.target) || 0,
      color: goal.color || '#6366f1' // default color
    }));

    res.json({ 
      goals: { 
        customGoals
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user goals
app.post('/api/goals', async (req, res) => {
  try {
    const { user_id, customGoals } = req.body;
    
    // Delete existing goals for the user
    await supabase
      .from('custom_goals')
      .delete()
      .eq('user_id', user_id);
    
    // Insert new goals
    if (customGoals && customGoals.length > 0) {
      const goalsToInsert = customGoals.map(goal => ({
        user_id,
        name: goal.name,
        current: goal.current,
        target: goal.target,
        color: goal.color
      }));
      
      const { error: insertError } = await supabase
        .from('custom_goals')
        .insert(goalsToInsert);
      
      if (insertError) {
        return res.status(400).json({ error: insertError.message });
      }
    }

    res.json({ message: 'Goals updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`MoneyBag backend server running on port ${PORT}`);
});

module.exports = app;