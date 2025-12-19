const {Store} = require('express-session');
const db = require('./database');
const path = require('path');

class SqliteStore extends Store {
    constructor(options = {}) {
        super(options);
        
        this.tableName = "session";
            
        this.cleanupInterval = setInterval(this.cleanup, (24*60*60*1000));
    }
    
    all(callback) {
        const rows = db.prepare(
            `SELECT ses 
            FROM ${this.tableName} 
            WHERE expire > ?`).all(Date.now());
        
        const sessions = rows.map(row => JSON.parse(row.session));
        
        callback(null, sessions);
    }
    
    destroy(sid, callback) {
        db.prepare(`DELETE FROM ${this.tableName} WHERE sid = ?`).run(sid);
        callback(null);
    }
    
    clear(callback) {
        db.prepare(`DELETE FROM ${this.tableName}`).run();
        callback(null);
    }
    
    //length(callback) {}
    
    get(sid, callback) {
        
        const search = db.prepare(
            `SELECT ses FROM ${this.tableName} WHERE 
            sid = ? AND expire > ?`).get(sid, Date.now());
        
        if(search) {
            try {
                let session = JSON.parse(search.ses);
                callback(null, session);
            }
            catch (err) {
                callback(err);
            }
            
        }
        else {
            callback(null, null);
        }
    }
    
    set(sid, session, callback) {
        const ses = JSON.stringify(session);
        const expire = Date.now() + (24*60*60*1000);
        
        db.prepare(`
            INSERT OR REPLACE INTO ${this.tableName}
            (sid, ses, expire) VALUES (?, ?, ?)`
        ).run(sid, ses, expire);
        
        callback(null);
    }
    
    cleanup() {
        db.prepare(`DELETE FROM ${table.tableName}
            WHERE expire < ?`).run(Date.now());
    }
    
    //touch(sid, session, callback) {}
}

module.exports = SqliteStore;