import supabase from './supabase.js';

async function testConnection() {
  const { data, error } = await supabase.from('users').select('*').limit(1);

// 查询 Supabase 表中的数据并与项目数据交互
const { data: users, error: usersError } = await supabase.from('users').select('*');

if (usersError) {
  console.error('查询失败:', usersError);
} else {
  console.log('查询成功:', users);
  // 在这里可以将 Supabase 数据与项目数据结合使用
}

// 插入测试用户数据
const { data: userData, error: userError } = await supabase
  .from('users')
  .insert([
    { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Test User', email: 'test@example.com' }
  ], { returning: 'minimal' });

if (userError) {
  console.error('用户数据插入失败:', userError);
} else {
  console.log('用户数据插入成功:', userData);

  // 插入关联的交易数据
  const { data: transactionData, error: transactionError } = await supabase
    .from('transactions')
    .insert([
      { user_id: '550e8400-e29b-41d4-a716-446655440000', amount: 100, description: '测试交易' }
    ], { returning: 'minimal' });

  if (transactionError) {
    console.error('交易数据插入失败:', transactionError);
  } else {
    console.log('交易数据插入成功:', transactionData);
  }
}
  if (error) console.error('Connection failed:', error);
  else console.log('Connection successful:', data);
}

testConnection();