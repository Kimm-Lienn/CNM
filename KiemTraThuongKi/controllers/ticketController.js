const { PutCommand, ScanCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { ddbClient } = require("../config/aws");

const TableName = "EventTickets";

// 1. Hiển thị danh sách & Tìm kiếm
exports.getTickets = async(req, res) => {
    try {
        const { search, status } = req.query;
        const data = await ddbClient.send(new ScanCommand({ TableName }));
        let tickets = data.Items || [];

        if (search) {
            const s = search.toLowerCase();
            tickets = tickets.filter(t => (t.eventName || "").toLowerCase().includes(s) || (t.holderName || "").toLowerCase().includes(s));
        }
        if (status) tickets = tickets.filter(t => t.status === status);

        res.render("index", { tickets });
    } catch (err) { res.send("Lỗi: " + err.message); }
};

// 2. Thêm vé mới
exports.addTicket = async(req, res) => {
    try {
        const { ticketId, eventName, holderName, category, quantity, pricePerTicket, eventDate, status } = req.body;
        const qty = parseInt(quantity) || 0;
        const price = parseFloat(pricePerTicket) || 0;

        let discount = 0;
        if (category === "VIP" && qty >= 4) discount = 0.1;
        else if (category === "VVIP" && qty >= 2) discount = 0.15;

        const finalAmount = (qty * price) * (1 - discount);

        await ddbClient.send(new PutCommand({
            TableName,
            Item: {
                ticketId: ticketId || Date.now().toString(),
                eventName,
                holderName,
                category,
                quantity: qty,
                pricePerTicket: price,
                eventDate,
                status,
                finalAmount,
                promoLabel: discount > 0 ? "Được giảm giá" : "Không giảm giá",
                imageUrl: req.file ? req.file.location : ""
            }
        }));
        res.redirect("/");
    } catch (err) { res.send(err.message); }
};

// 3. Xóa vé (Dùng cho nút Xóa)
exports.deleteTicket = async(req, res) => {
    try {
        await ddbClient.send(new DeleteCommand({
            TableName,
            Key: { ticketId: req.params.id }
        }));
        res.redirect("/");
    } catch (err) { res.send("Lỗi xóa: " + err.message); }
};

// 4. Lấy dữ liệu để đổ vào form Sửa
exports.getEditPage = async(req, res) => {
    try {
        const data = await ddbClient.send(new GetCommand({
            TableName,
            Key: { ticketId: req.params.id }
        }));
        res.render("edit", { ticket: data.Item });
    } catch (err) { res.send("Lỗi tải trang sửa: " + err.message); }
};
// 5. Cập nhật vé (Update)
exports.updateTicket = async(req, res) => {
    try {
        const { ticketId, eventName, holderName, category, quantity, pricePerTicket, eventDate, status, oldImageUrl } = req.body;
        const qty = parseInt(quantity) || 0;
        const price = parseFloat(pricePerTicket) || 0;

        // Tính lại nghiệp vụ
        let discount = 0;
        if (category === "VIP" && qty >= 4) discount = 0.1;
        else if (category === "VVIP" && qty >= 2) discount = 0.15;
        const finalAmount = (qty * price) * (1 - discount);

        await ddbClient.send(new PutCommand({
            TableName: "EventTickets",
            Item: {
                ticketId, // PK giữ nguyên để ghi đè
                eventName,
                holderName,
                category,
                quantity: qty,
                pricePerTicket: price,
                eventDate,
                status,
                finalAmount,
                promoLabel: discount > 0 ? "Được giảm giá" : "Không giảm giá",
                // Nếu có file mới thì dùng link mới, không thì dùng link cũ
                imageUrl: req.file ? req.file.location : oldImageUrl
            }
        }));
        res.redirect("/");
    } catch (err) { res.send("Lỗi cập nhật: " + err.message); }
};