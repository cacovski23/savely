<%@ Page Language="C#" ValidateRequest="false" AutoEventWireup="true" CodeBehind="map.aspx.cs" Inherits="Invoicebus.savely.map" %>
<%@ Register assembly="Ext.Net" namespace="Ext.Net" tagprefix="ext" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Savely</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        width:100%;
        height: 500px;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: Arial, helvetica, Sans-Serif;
      }
      
      .cb_options
      {
          display: flex;
          flex-wrap: wrap;
          border: 2px solid #ccc;
          justify-content: space-between;
          border-left: none;
          border-right: none;
          background: #f5f5f5;
      }
      
      .cb_options>div
      {
        padding: 30px;
      }
      
      .btn
      {
          background: #ff5722;
          padding: 20px;
          text-align: center;
          box-sizing: border-box;
          color: White;
          text-decoration: none;
          display: block;
          width: 300px;
          border: none;
          margin: 20px auto;          
      }
      
      .gallery
      {
          max-height: 100px;
          display: flex;
      }
      
      .gallery a
      {
          display: block;
          overflow: hidden;
      }
      
      .gallery img
      {
          margin: 10px;
      }

      .report_window
      {
        position: fixed;
        width: 450px;
        height: 600px;
        margin: 5% auto; /* Will not center vertically and won't work in IE6/7. */
        top: 0;
        left: 0;
        right: 0;

        background: white;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        -webkit-box-shadow: 0 12px 30px rgba(0,0,0,0.6);
        -moz-box-shadow: 0 12px 30px rgba(0,0,0,0.6);
        box-shadow: 0 12px 30px rgba(0,0,0,0.6);
        border: none;
        visibility:hidden;
      }
      
      .report_window iframe
      {
          width: 450px;
          height: 600px;
      }

      .mask
      {
        position: fixed;
        width: 100%;
        height: 100%;
        background: Black;
        opacity: 0.6;
        display: block;
        top: 0;
        visibility: hidden;
        }
        
        @media screen and (max-width: 600px) 
        {
            .report_window,
            .report_window iframe
            {
                width: 100% !important;
                height: 100% !important;
                margin:0 !important;
                border-radius: 0px !important;
            }
            
            .cb_options
            {
                flex-direction: column !important;
            }   
        }
    </style>
    
    <script src="/savely/jQuery/jquery-1.7.min.js"></script>
    <script src="/savely/jQuery/jquery-ui-1.9.0.custom.min.js"></script>    
    <script src="/savely/js/map.js"></script>	

    <script>
        var sat_data;
        var people_data;
        var heatmap_data;

        function showReportFireWindow() {
            Ext.get('mks').show();
            Ext.get('rp_win').show();
        }

        function hideReportFireWindow() {
            Ext.get('mks').hide();
            Ext.get('rp_win').hide();
        }

        var setSateliteData = function (data) {
            sat_data = data
            setSateliteMarkers(map);            
        }

        var setPeopleData = function (data) {
            people_data = data;
        }

        var setHeatmapData = function (data) {
            heatmap_data = data;
            setHeatmap(map);
            toggleHeatmap();
        }
    </script>

    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
  </head>
<body runat="server">
    <form id="form1" runat="server">
        <div id="map"></div>

        <ext:ResourceManager runat="server" Theme="Default" ScriptMode="Release">
        </ext:ResourceManager>

        <div class="cb_options">
            <div>
                <ext:Checkbox ID="Checkbox1" runat="server" BoxLabel="Show crowd sourced data (data from civilians)" HideLabel="true">
                    <Listeners>
                        <Check Handler="if(this.checked)
                                            setPeopleMarkers(map)
                                         else
                                            removePeopleMarkers(map)
                                        " />
                    </Listeners>
                </ext:Checkbox>
            </div>

            <div>
                <ext:Checkbox ID="Checkbox2" runat="server" BoxLabel="Show NRT (near real-time) satelite data" HideLabel="true" Checked="true">
                    <Listeners>
                        <Check Handler="
                                        if(this.checked)
                                            setSateliteMarkers(map);
                                        else
                                            removeSateliteMarkers(map);
                                        " />
                    </Listeners>
                </ext:Checkbox>
            </div>

            <div>
                <ext:Checkbox ID="Checkbox3" runat="server" BoxLabel="Show fire forecast" HideLabel="true">
                    <Listeners>
                        <Check Handler="toggleHeatmap();" />
                    </Listeners>
                </ext:Checkbox>                
            </div>

            <div>
                <ext:Checkbox ID="Checkbox4" runat="server" BoxLabel="Show near fire stations" HideLabel="true">
                    <Listeners>
                        <Check Handler="
                                        if(this.checked)
                                            setNearFireStations(map);
                                        else
                                            removeFireStationMarkers(map);
                                        " />
                    </Listeners>
                </ext:Checkbox>
            </div>
        </div>
        <a href="javascript:void(0);" onclick="showReportFireWindow()" class="btn"><i class="fa fa-fire"></i> Report a fire</a>
    </form>

    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUrsWAT00vuFuhc_GYPcJfoqlk0hFvczk&callback=initMap&libraries=visualization,places&callback=initMap"></script>

    <div class="mask" id="mks"></div>
    <div class="report_window" id="rp_win"><iframe src="/savely/report_fire/" frameborder="0"></iframe>
        <div style="position: absolute; top: 5px; left: 5px; font-size: 26px; color: #888; cursor: pointer;" onclick="hideReportFireWindow()"><i class="fa fa-window-close"></i></div>
    </div>    
</body>
</html>
