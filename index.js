const express = require('express')
const uuid = require('uuid')


const port = 3000
const app = express()
app.use(express.json())

const orderHamburger = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orderHamburger.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(400).json({ message: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}



app.post('/order', (request, response) => {

    const { order, clientName, price, status } = request.body

    const NewClient = { id: uuid.v4(), order, clientName, price, status: "Pedido Aceito" }

    orderHamburger.push(NewClient)

    return response.status(201).json(NewClient)

})

app.get('/order', (request, response) => {

    return response.status(200).json(orderHamburger)
})

app.put('/order/:id', checkOrderId, (request, response) => {

    const index = request.orderIndex
    const id = request.orderId

    const { order, clientName, price, status } = request.body

    const updatedOrder = { id: uuid.v4(), order, clientName, price, status: "Em Preparação" }

    orderHamburger[index] = updatedOrder

    return response.status(202).json(updatedOrder)

})

app.delete('/order/:id', checkOrderId, (request, response) => {

    const index = request.orderIndex
    const id = request.orderId

    orderHamburger.splice(index, 1)
    return response.status(204).json(orderHamburger)

})

app.get('/order/:id', checkOrderId, (request, response) => {

    const index = request.orderIndex

    return response.status(205).json(orderHamburger[index])

})

app.patch('/order/:id', checkOrderId, (request, response) => {

    const index = request.orderIndex

    const newStatus = { ...orderHamburger[index], status: "Pedido Pronto" }

    orderHamburger[index] = newStatus

    return response.status(210).json(newStatus)

})

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`)
})