const pool = require("../database/mysql_pool");
const { transactionWrapper } = require("./utility");


class Category {
    constructor({ cid, name }) {
        this.cid = cid;
        this.name = name;
    }
};


/**
 * @param {Category} newCategory
 * @returns {Promise<Number>} insertId
 */
Category.create = async function (newCategory) {
    let sql = "INSERT INTO Category SET name = ?";
    let rows = await transactionWrapper(async(conn) => (await conn.query(sql, [newCategory.name]))[0]);

    console.log(`Created category{ cid: ${rows.insertId} }`);
    return rows.insertId;
};


async function findOne(column, key) {
    const sql = "SELECT * FROM Category WHERE ?? = ?";
    let rows = await transactionWrapper(async(conn) => (await conn.query(sql, [column, key]))[0]);

    if (rows.length == 0) {
        console.error(`Can not found category{ ${column}: ${key} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found category{ ${column}: ${key} }`);
        return new Category(rows[0]);
    }
};
async function existOne(column, key) {
    try{
        await findOne(column, key);
        console.log(`Exsit category { ${column}: ${key} }`);
        return true;
    }catch(err){
        console.log(`Not exsit category { ${column}: ${key} }`);
        return false;
    }
};


Category.findById = async (id) => findOne("cid", id);
Category.findByName = async (name) => findOne("name", name);
Category.existById = async (id) => existOne("cid", id);
Category.existByName = async (name) => existOne("name", name);



/**
 * @param {{name: String}} filter
 * @returns {Promise<Category[]>}
 */
Category.findAll = async function (filter) {
    if (!filter) filter = {};
    let sql = `
    SELECT * FROM Category 
    WHERE name LIKE IFNULL(CONCAT('%', ?, '%'), name)
    ORDER BY cid ASC
    `;
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [filter.name]))[0]);

    console.log(`Found ${rows.length} categories`);
    return rows.map((val) => new Category(val));
};


/**
 * @param {Number} id 
 * @param {Category} category
 */
Category.updateById = async function (id, category) {
    let sql = `
    UPDATE Category 
    SET 
        name = IFNULL(?, name)
    WHERE cid = ?
    `;
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [category.name, id]))[0]);

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not category{ cid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Updated category{ cid: ${id} }`);
        return true;
    }
};


/**
 * @param {Number} id 
 */
Category.deleteById = async function (id) {
    let sql = `DELETE FROM Category WHERE cid = ?`;
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [id]))[0]);

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not category{ cid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted category{ cid: ${id} }`);
        return true;
    }
};

module.exports = Category;