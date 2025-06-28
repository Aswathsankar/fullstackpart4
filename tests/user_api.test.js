test('creation fails if username too short', async () => {
  const newUser = { username: 'ab', name: 'Short', password: '123456' }
  await api.post('/api/users').send(newUser).expect(400)
})
