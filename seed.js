const Product = require('./models/Products')

let seedProductsArr = [
    {
        name: "Iphone 14 pro",
        img: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGlwaG9uZSUyMDE0fGVufDB8fDB8fHww",
        price: 120000,
        desc: "bohot mehenga hai"
    },
    {
        name: "Ipad",
        img: "https://images.unsplash.com/photo-1526430752879-b9eb53fbd772?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGlwYWR8ZW58MHwwfDB8fHww",
        price: 80000,
        desc: "ipad bhi mehenga hai"
    },
    {
        name: "iwatch",
        img: "https://images.unsplash.com/photo-1514793011838-f19fbcc1fe04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGl3YXRjaHxlbnwwfDB8MHx8fDA%3D",
        price: 70000,
        desc: "iwatch thik thak hai"
    },
    {
        name: "macbook",
        img: "https://images.unsplash.com/photo-1507470828332-ab3b90a0a13f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIwfHxtYWNib29rfGVufDB8MHwwfHx8MA%3D%3D",
        price: 240000,
        desc: "macbook description"
    },
]

async function seedDB(){
    await Product.insertMany(seedProductsArr)
    console.log("data SEEDED successfully.");
};

module.exports = seedDB;