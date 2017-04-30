using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Ext.Net;
using Newtonsoft.Json.Linq;
using MySql.Data.MySqlClient;

namespace Invoicebus.savely
{
    public partial class report_fire : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public void createReport(JObject fire_report)
        {
            MySqlConnection conn = new MySqlConnection(Utils.ConnString);
            MySqlCommand cmd;
            MySqlParameter prm = null;

            try
            {
                conn.Open();

                cmd = new MySqlCommand(@"INSERT INTO _savely_fire_reports 
                                        (
                                            latitude,
                                            longitude,
                                            name,
                                            phone,
                                            description, 
                                            date,
                                            time,
                                            datetime,
                                            images
                                        ) 
                                    VALUES ( 
                                            @latitude,
                                            @longitude,
                                            @name,
                                            @phone,
                                            @description, 
                                            @date,                                            
                                            @time,
                                            @datetime,
                                            @images); SELECT LAST_INSERT_ID();", conn);

                JToken t;
                prm = new MySqlParameter("@latitude", MySqlDbType.VarChar);
                prm.Value = fire_report.TryGetValue("latitude", out t) ? fire_report["latitude"].ToString() : string.Empty;
                cmd.Parameters.Add(prm);

                prm = new MySqlParameter("@longitude", MySqlDbType.VarChar);
                prm.Value = fire_report.TryGetValue("longitude", out t) ? fire_report["longitude"].ToString() : string.Empty;
                cmd.Parameters.Add(prm);

                prm = new MySqlParameter("@name", MySqlDbType.VarChar);
                prm.Value = fire_report.TryGetValue("name", out t) ? fire_report["name"].ToString() : string.Empty;
                cmd.Parameters.Add(prm);

                prm = new MySqlParameter("@phone", MySqlDbType.VarChar);
                prm.Value = fire_report.TryGetValue("phone", out t) ? fire_report["phone"].ToString() : string.Empty;
                cmd.Parameters.Add(prm);

                prm = new MySqlParameter("@description", MySqlDbType.VarChar);
                prm.Value = fire_report.TryGetValue("description", out t) ? fire_report["description"].ToString() : string.Empty;
                cmd.Parameters.Add(prm);

                prm = new MySqlParameter("@date", MySqlDbType.VarChar);
                prm.Value = fire_report.TryGetValue("date", out t) ? fire_report["date"].ToString() : string.Empty;
                cmd.Parameters.Add(prm);

                prm = new MySqlParameter("@time", MySqlDbType.VarChar);
                prm.Value = fire_report.TryGetValue("time", out t) ? fire_report["time"].ToString() : string.Empty;
                cmd.Parameters.Add(prm);

                prm = new MySqlParameter("@datetime", MySqlDbType.DateTime);
                prm.Value = DateTime.Now;
                cmd.Parameters.Add(prm);

                prm = new MySqlParameter("@images", MySqlDbType.LongText);
                prm.Value = fire_report.TryGetValue("images", out t) ? fire_report["images"].ToString() : string.Empty;
                cmd.Parameters.Add(prm);

                cmd.ExecuteNonQuery();
            }

            catch (Exception Ex)
            {
                Utils.DebugToFile(Ex.ToString());
            }

            finally
            {
                conn.Close();
                conn.Dispose();
            }            
        }

        public void SubmitReport(object sender, EventArgs e)
        {            
            JObject fire_report = new JObject();

            fire_report["latitude"] = fire_position.Value.Split(',')[0];
            fire_report["longitude"] = fire_position.Value.Split(',')[1];

            fire_report["name"] = name.Value;
            fire_report["phone"] = phone.Value;
            fire_report["description"] = desc.Value;
            fire_report["date"] = DateTime.Now.ToString("yyyy-MM-dd");
            fire_report["time"] = DateTime.UtcNow.ToShortTimeString();
            
            JArray images = new JArray();
            JObject file;
            string[] base64_strings = file_array.Value.ToString().Split(new string[] { "#||#" }, StringSplitOptions.None);

            foreach (string item in base64_strings)
            {
                if (!string.IsNullOrEmpty(item))
                {
                    file = new JObject();
                    file["img"] = item;
                    images.Add(file);
                }
            }

            fire_report["images"] = images;

            createReport(fire_report);
            main_cnt.InnerHtml = "<div class='thanks'><i class='fa fa-fire-extinguisher'></i> <br/><br/>Thank you for your report! <br><br>The closest fire station in the area will investigate the case and act accordingly as soon as possible. If you are affected by the fire, please follow these <a href='http://savely.con.mk/safety-instructions/' target='_blank'>emergency instructions</a>.<br/><br/><a href='/savely/report_fire/'>Report New Fire</a></div>";
        }
    }
}