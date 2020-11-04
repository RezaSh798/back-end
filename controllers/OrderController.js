const Order = require('../models/Order');
const User = require('../models/User');

module.exports = {
    getOrders: (req, res) => {
        Order.find()
        .populate('customer')
        .exec((err, orders) => {
            if(err) throw(err)
            res.status(200).json(orders);
        });
    },
    getOrder: (req, res) => {
        Order.findOne({_id: req.params.id})
        .populate('customer')
        .exec((err, order) => {
            if(err) throw(err);
            if(!order) {
                res.status(404).json({message: `سفارشی با id:${req.params.id} پیدا نشد!`});
            }
            else {
                res.status(200).json(order);
            }
        });
    },
    newOrder: (req, res) => {
        const newOrder = req.body;
        Order.create({
            customer: newOrder.customer,
        })
        .then(order => {
            newOrder.items.forEach(async item => {
                await Order.updateOne(
                    {_id: order._id},
                    {$push: {
                        orders: {
                            title: item.title,
                            count: item.count,
                            price: item.price
                        }
                    }}
                );
            });

            User.updateOne(
                {_id: newOrder.customer},
                {$push: {factors: order._id}}
            )
            .then(() => {
                res.status(201).json({message: 'سفارش شما با موفقیت ثبت گردید!'});
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    },
    updateOrder: (req, res) => {
        res.status(200).json({message: 'update order route!'});
    },
    deleteOrder: (req, res) => {
        Order.findOne({_id: req.params.id})
        .then(order => {
            User.updateOne(
                {_id: order.customer},
                {$pull: {factors: req.params.id}}
            )
            .then(() => {
                order.delete();
                res.status(200).json({message: 'سفارش مورد نظر با موفقیت پاک شد!'});
            });
        })
    }
}