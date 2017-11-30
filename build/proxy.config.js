/**
 * Created by wenruo on 2017/4/19.
 */

module.exports = {
    devServer: {
        proxy: {
            "api":{//代理匹配
                target:"",//域名
                changeOrigin:true
            },
            '/api2':{
              target:"",//域名
              changeOrigin:true
            }
        }
    }
};