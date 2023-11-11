const pool = require("../database/mysql_pool");
const { transactionWrapper } = require("./utility");


class User {
    constructor({ uid, role, login_id, password, name, created_at }) {
        this.uid = uid;
        this.role = role;
        this.login_id = login_id;
        this.password = password;
        this.name = name;
        this.created_at = created_at;
    }
};


/**
 * @param {User} newUser 
 * @returns {Promise<Number>} insertId
 */
User.create = async function (newUser) {
    let sql = `
    INSERT INTO User 
    SET 
        login_id = ?,
        password = ?, 
        name = ?,
        role = IFNULL(?, 0)
    `;
    let vals = [newUser.login_id, newUser.password, newUser.name, newUser.role];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    console.log(`Created user{ uid: ${rows.insertId} }`);
    return rows.insertId;
};


async function findOne(column, key) {
    const sql = "SELECT * FROM User WHERE ?? = ?";
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [column, key]))[0]);
    
    if (rows.length == 0) {
        console.error(`Can not found user{ ${column}: ${key} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found user{ ${column}: ${key} }`);
        return new User(rows[0]);
    }
};
async function existOne(column, key) {
    try{
        await findOne(column, key);
        console.log(`Exsit user { ${column}: ${key} }`);
        return true;
    }catch(err){
        console.log(`Not exsit user { ${column}: ${key} }`);
        return false;
    }
}


User.findById = async (id) => findOne("uid", id);
User.findByLoginId = async (login_id) => findOne("login_id", login_id);
User.existById = async (id) => existOne("uid", id);
User.existByLoginId = async (login_id) => existOne("login_id", login_id);


/**
 * @param {{name: String}} filter
 * @returns {Promise<User[]>}
 */
User.findAll = async function (filter) {
    if (!filter) filter = {};
    let sql = `
    SELECT * FROM User 
    WHERE name LIKE IFNULL(CONCAT('%', ?, '%'), name)
    ORDER BY uid ASC
    `;
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [filter.name]))[0]);

    console.log(`Found ${rows.length} users`);
    return rows.map((val) => new User(val));
};


/**
 * @param {Number} id 
 * @param {User} user
 */
User.updateById = async function (id, user) {
    let sql = `
    UPDATE User 
    SET 
        role = IFNULL(?, role),
        login_id = IFNULL(?, login_id),
        password = IFNULL(?, password),
        name = IFNULL(?, name),
        created_at = IFNULL(?, created_at)
    WHERE uid = ?
    `;
    let vals = [user.role, user.login_id, user.password, 
        user.name, user.created_at, id];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not user{ uid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Updated user{ uid: ${id} }`);
        return true;
    }
};


/**
 * @param {Number} id 
 */
User.deleteById = async function (id) {
    let sql = `DELETE FROM User WHERE uid = ?`;
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [id]))[0]);

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not user{ uid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted user{ uid: ${id} }`);
        return true;
    }
};

module.exports = User;