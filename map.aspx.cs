using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Ext.Net;
using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;

namespace Invoicebus.savely
{
    public partial class map : System.Web.UI.Page
    {
        public JArray getSateliteData()
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

                return fires;
            }

            catch (Exception Ex)
            {
                return new JArray();
            }

            finally
            {
                conn.Close();
                conn.Dispose();
            }
        }

        public JArray getPeopleData()
        {
            MySqlConnection conn = new MySqlConnection(Utils.ConnString);
            JObject data = new JObject();
            JArray fires = new JArray();

            MySqlCommand cmd;

            try
            {
                conn.Open();
                cmd = new MySqlCommand("SELECT * FROM _savely_fire_reports", conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    data = new JObject();
                    var columns = Enumerable.Range(0, reader.FieldCount).Select(reader.GetName).ToList();
                    foreach (string column in columns)
                        data[column] = reader[column].ToString();

                    fires.Add(data);
                }

                return fires;
            }

            catch (Exception Ex)
            {
                return new JArray();
            }

            finally
            {
                conn.Close();
                conn.Dispose();
            }
        }

        public JArray getHeatmapData()
        {
            MySqlConnection conn = new MySqlConnection(Utils.ConnString);
            JObject data = new JObject();
            JArray fires = new JArray();

            MySqlCommand cmd;

            try
            {
                conn.Open();
                cmd = new MySqlCommand("SELECT * FROM _savely_heatmap", conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    data = new JObject();
                    var columns = Enumerable.Range(0, reader.FieldCount).Select(reader.GetName).ToList();
                    foreach (string column in columns)
                        data[column] = reader[column].ToString();

                    fires.Add(data);
                }

                return fires;
            }

            catch (Exception Ex)
            {
                return new JArray();
            }

            finally
            {
                conn.Close();
                conn.Dispose();
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            X.Js.Call("setSateliteData", getSateliteData());
            X.Js.Call("setPeopleData", getPeopleData());
            X.Js.Call("setHeatmapData", getHeatmapData());
            //X.Js.Call("hideReportFireWindow", getPeopleData());

            Response.AddHeader("X-Frame-Options", "ALLOW");
        }        
    }
}