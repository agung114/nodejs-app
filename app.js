const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send(`
        <h1>Data Diri V1</h1>
        <p>Nama: Agung Sudarmanto</p>
        <p>Role: Cloud & DevOps Engineer</p>
        <p>Version: 1.0</p>
    `);

   
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

  