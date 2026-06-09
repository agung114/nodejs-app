const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send(`
        <h1>Data Diri V2</h1>
        <p>Nama: Agung Sudarmanto 3</p>
        <p>Role: Cloud Engineer</p>
        <p>Skill: AWS, Azure, Docker, Kubernetes</p>
        <p>Version: 3.0</p>
    `);
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});


  