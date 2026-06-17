const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send(`
        <h1>Data Diri agung ganteng bangetV100</h1>
        <p>Nama: Agung Sudarmanto </p>
        <p>Role: Cloud Engineer</p>
        <p>Skill: AWS, Azure, Docker, Kubernetes</p>
        <p>Version: 100.0</p>
    `);
});
app.listen(3000, () => {
    console.log('release v100');
});


  