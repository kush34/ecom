import { Request, Response } from 'express';
import { Order } from "../models/orderModel";
import Product from "../models/productModel";

export const dashboard = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const nineMonthsAgo = new Date(now.getTime() - 270 * 24 * 60 * 60 * 1000);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);

        // Fire all queries in parallel
        const [
            totalOrders,
            previousTotalOrders,
            weeklySalesResult,
            previousWeeklySalesResult,
            last7DaysOrders,
            productCount,
            previousProductCount,
            successRateData,
            previousSuccessRateData,
            last30DaysSales,
            last9MonthsRevenue,
            yearlyEarning,
            previousYearlyEarning
        ] = await Promise.all([
            // 1. Total Orders (current)
            Order.countDocuments(),

            // 2. Total Orders (previous period)
            Order.countDocuments({
                createdAt: { $lt: sevenDaysAgo }
            }),

            // 3. Weekly Sales (current)
            Order.aggregate([
                {
                    $match: {
                        status: "paid",
                        createdAt: { $gte: sevenDaysAgo, $lte: now }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$total_price" }
                    }
                }
            ]),

            // 4. Weekly Sales (previous week)
            Order.aggregate([
                {
                    $match: {
                        status: "paid",
                        createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$total_price" }
                    }
                }
            ]),

            // 5. Last 7 days order counts (for chart)
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sevenDaysAgo, $lte: now }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),

            // 6. Product Count (current)
            Product.countDocuments(),

            // 7. Product Count (7 days ago)
            Product.countDocuments({
                createdAt: { $lt: sevenDaysAgo }
            }),

            // 8. Success Rate (current week)
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sevenDaysAgo, $lte: now }
                    }
                },
                {
                    $facet: {
                        total: [{ $count: "count" }],
                        paid: [
                            { $match: { status: "paid" } },
                            { $count: "count" }
                        ]
                    }
                }
            ]),

            // 9. Success Rate (previous week)
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
                    }
                },
                {
                    $facet: {
                        total: [{ $count: "count" }],
                        paid: [
                            { $match: { status: "paid" } },
                            { $count: "count" }
                        ]
                    }
                }
            ]),

            // 10. Last 30 days sales (for discounted sales chart)
            Order.aggregate([
                {
                    $match: {
                        status: "paid",
                        createdAt: { $gte: thirtyDaysAgo, $lte: now }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        value: { $sum: "$total_price" }
                    }
                },
                { $sort: { _id: 1 } }
            ]),

            // 11. Last 9 months revenue
            Order.aggregate([
                {
                    $match: {
                        status: "paid",
                        createdAt: { $gte: nineMonthsAgo, $lte: now }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        income: { $sum: "$total_price" }
                    }
                },
                { $sort: { _id: 1 } }
            ]),

            // 12. Yearly earning (current year)
            Order.aggregate([
                {
                    $match: {
                        status: "paid",
                        createdAt: { $gte: startOfYear, $lte: now }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$total_price" }
                    }
                }
            ]),

            // 13. Yearly earning (last year)
            Order.aggregate([
                {
                    $match: {
                        status: "paid",
                        createdAt: { $gte: startOfLastYear, $lte: endOfLastYear }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$total_price" }
                    }
                }
            ])
        ]);

        // Helper function to calculate percentage change
        const calculateChange = (current: number, previous: number): string => {
            if (previous === 0) return current > 0 ? '+100%' : '0%';
            const change = ((current - previous) / previous) * 100;
            return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
        };

        // Process results
        const weeklySales = weeklySalesResult[0]?.total || 0;
        const previousWeeklySales = previousWeeklySalesResult[0]?.total || 0;
        
        const totalOrdersCount = totalOrders;
        
        const paidOrders = successRateData[0]?.paid[0]?.count || 0;
        const totalOrdersForRate = successRateData[0]?.total[0]?.count || 1;
        const successRate = (paidOrders / totalOrdersForRate) * 100;

        const previousPaidOrders = previousSuccessRateData[0]?.paid[0]?.count || 0;
        const previousTotalOrdersForRate = previousSuccessRateData[0]?.total[0]?.count || 1;
        const previousSuccessRate = (previousPaidOrders / previousTotalOrdersForRate) * 100;

        // Format chart data for last 7 days
        const chartData = Array(7).fill(0);
        last7DaysOrders.forEach(day => {
            const dayIndex = Math.floor((new Date(day._id).getTime() - sevenDaysAgo.getTime()) / (24 * 60 * 60 * 1000));
            if (dayIndex >= 0 && dayIndex < 7) chartData[dayIndex] = day.count;
        });

        // Format monthly sales data
        const discountedSalesData = last30DaysSales.map(day => ({
            date: new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: day.value
        }));

        const discountedSalesTotal = last30DaysSales.reduce((sum, day) => sum + day.value, 0);

        // Format revenue by month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueData = last9MonthsRevenue.map(month => {
            const [year, monthNum] = month._id.split('-');
            return {
                month: monthNames[parseInt(monthNum) - 1],
                income: month.income,
                expense: -Math.floor(month.income * 0.3) // 30% expense assumption
            };
        });

        const yearlyEarningTotal = yearlyEarning[0]?.total || 0;
        const previousYearlyEarningTotal = previousYearlyEarning[0]?.total || 0;
        const totalBudget = yearlyEarningTotal * 1.5;
        const yearlyExpense = Math.floor(yearlyEarningTotal * 0.4);

        // Build response
        const response = {
            totalOrders: {
                label: 'Total Order',
                value: totalOrdersCount.toLocaleString(),
                change: calculateChange(totalOrdersCount, previousTotalOrders),
                trend: totalOrdersCount >= previousTotalOrders ? 'up' : 'down',
                chartData: chartData
            },
            weeklySales: {
                label: 'Weekly Sales',
                value: `₹${weeklySales.toLocaleString()}`,
                change: calculateChange(weeklySales, previousWeeklySales),
                trend: weeklySales >= previousWeeklySales ? 'up' : 'down',
                chartData: chartData.map(val => val * 100)
            },
            products: {
                label: 'Products',
                value: productCount >= 1000 ? `${(productCount / 1000).toFixed(1)}K` : productCount.toString(),
                change: calculateChange(productCount, previousProductCount),
                trend: productCount >= previousProductCount ? 'up' : 'down',
                chartData: chartData.map(val => val * 50)
            },
            refunds: {
                label: 'Refunds',
                value: `${successRate.toFixed(1)}%`,
                change: calculateChange(successRate, previousSuccessRate),
                trend: successRate >= previousSuccessRate ? 'up' : 'down',
                chartData: chartData.map(val => val * 80)
            },
            discountedSales: Math.floor(discountedSalesTotal),
            discountedSalesData: discountedSalesData,
            revenueData: revenueData,
            totalBudget: Math.floor(totalBudget),
            earning: Math.floor(yearlyEarningTotal),
            expense: yearlyExpense
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
};