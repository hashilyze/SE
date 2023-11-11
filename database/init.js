const pool = require('./mysql_pool');
const fs = require('fs/promises');


// Database Setup
exports.init = async function(){
    let conn = await pool.promise().getConnection();
    let option = {encoding: 'utf-8'};
    let path = './database/sqls/';

    let excute = async (name) => {
        let stmt = await fs.readFile(path + name, option);
        await conn.query(stmt);
    };
    try{
        await conn.beginTransaction(); 

        // === Create database ===
        await excute('database.sql');
        // === Create tables ===
        // Create User
        await excute('table_user.sql');
        // Create Format
        await excute('table_format.sql');
        // Create Category
        await excute('table_category.sql');
        // Create Post
        await excute('table_post.sql');
        // Create Basket
        await excute('table_basket.sql');
        // Create Logs
        await excute('table_user_log.sql');
        // === Create views ===
        // Create XPost
        await excute('view_xpost.sql');
        // Create XBasket
        await excute('view_xbasket.sql');
        // === Insert default records ===
        await excute('setup_default.sql');

        await conn.commit();
        console.log("Success to initialize database");
    } catch(err){
        await conn.rollback();
        console.error("Can not initialze database");
        console.error(err);
    } finally{
        conn.release();
    }
};

if(typeof require !== 'undefined' && require.main === module){
    console.log("Start Database Initialization");
    this.init().then(() => {
        console.log("End Proccess");
        process.exit(0)
    });
}