const express = require('express')
const path = require('path')
const app = express()

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, '../Public')))


app.get('/', (req, res) => {
    res.render('index')
})



const PORT = process.env.PORT || 4004
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})