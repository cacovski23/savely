using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;

namespace Invoicebus.savely
{
    /// <summary>
    /// Summary description for get_fire_data
    /// </summary>
    public class get_fire_data : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {

            MySqlConnection conn = new MySqlConnection(Utils.ConnString);
            JObject data = new JObject();
            JArray fires = new JArray();

            MySqlCommand cmd;

            try
            {
                conn.Open();
                cmd = new MySqlCommand("SELECT * FROM _savely_fires", conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    data = new JObject();
                    var columns = Enumerable.Range(0, reader.FieldCount).Select(reader.GetName).ToList();
                    foreach (string column in columns)
                        data[column] = reader[column].ToString();

                    fires.Add(data);
                }

                context.Response.ContentType = "text/plain";
                context.Response.Write(fires);
            }

            catch (Exception Ex)
            {
            }

            finally
            {
                conn.Close();
                conn.Dispose();
            }            
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}