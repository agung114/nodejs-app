const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send(`
        <h1>Data Diri V2</h1>
        <p>Nama: Agung Sudarmanto</p>
        <p>Role: Cloud Engineer</p>
        <p>Skill: AWS, Azure, Docker, Kubernetes</p>
        <p>Version: 2.0</p>
    `);
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});


  