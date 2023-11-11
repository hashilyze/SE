const pool = require("../database/mysql_pool");
const { transactionWrapper } = require("./utility");


class Format {
    constructor({ fid, name }) {
        this.fid = fid;
        this.name = name;
    }
};


/**
 * @param {Format} newFormat
 * @returns {Promise<Number>} insertId
 */
Format.create = async function (newFormat) {
    let sql = "INSERT INTO Format SET name = ?";
    let rows = await transactionWrapper(async(conn) => (await conn.query(sql, [newFormat.name]))[0]);

    console.log(`Created format{ fid: ${rows.insertId} }`);
    return rows.insertId;
};


async function findOne(column, key) {
    const sql = "SELECT * FROM Format WHERE ?? = ?";
    let rows = await transactionWrapper(async(conn) => (await conn.query(sql, [column, key]))[0]);

    if (rows.length == 0) {
        console.error(`Can not found format{ ${column}: ${key} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found format{ ${column}: ${key} }`);
        return new Format(rows[0]);
    }
};
async function existOne(column, key) {
    try{
        await findOne(column, key);
        console.log(`Exsit format { ${column}: ${key} }`);
        return true;
    }catch(err){
        console.log(`Not exsit format { ${column}: ${key} }`);
        return false;
    }
}


Format.findById = async (id) => findOne("fid", id);
Format.findByName = async (name) => findOne("name", name);
Format.existById = async (id) => existOne("fid", id);
Format.existByName = async (name) => existOne("name", name);


/**
 * @param {{name: String}} filter
 * @returns {Promise<Format[]>}
 */
Format.findAll = async function (filter) {
    if (!filter) filter = {};
    let sql = `
    SELECT * FROM Format 
    WHERE name LIKE IFNULL(CONCAT('%', ?, '%'), name)
    ORDER BY fid ASC
    `;
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [filter.name]))[0]);

    console.log(`Found ${rows.length} formats`);
    return rows.map((val) => new Format(val));
};


/**
 * @param {Number} id 
 * @param {Format} format
 */
Format.updateById = async function (id, format) {
    let sql = `
    UPDATE Format 
    SET 
        name = IFNULL(?, name)
    WHERE fid = ?
    `;
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [format.name, id]))[0]);

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not format{ fid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Updated format{ fid: ${id} }`);
        return true;
    }
};


/**
 * @param {Number} id 
 */
Format.deleteById = async function (id) {
    let sql = `DELETE FROM Format WHERE fid = ?`;
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [id]))[0]);

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not format{ fid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted format{ fid: ${id} }`);
        return true;
    }
};

module.exports = Format;