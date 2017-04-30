<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="report_fire.aspx.cs" Inherits="Invoicebus.savely.report_fire" %>
<%@ Register Assembly="Ext.Net" Namespace="Ext.Net" TagPrefix="ext" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Report a Fire</title>

    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        width:100%;
        height: 400px;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: Arial, helvetica, Sans-Serif;
      }

      h1
      {
          font-size: 20px;
          text-align: center;          
          margin: 20px 0;
          color: #333;
          margin-top:40px;
      }

      h2
      {
          color: #555;
          text-align: center;
          font-size: 15px;
          margin-bottom: 30px;
          color: #ff5722;
      }
      
      h2 a
      {
          color: #ff5722;
      }
      
      .input
      {
          width: 100%;
          height: 30px;
          padding: 20px;
          border: none;
          border-bottom: 1px solid #ccc;
          box-sizing: border-box;
          font-family: Arial, helvetica, Sans-Serif;
          margin-top:10px;
      }
      
      .input:focus
      {
          outline: none;
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
          margin: 20px auto;
          width: 200px;
          border: none;
          margin-bottom: 40px;
      }
      
      .dropzone {
        border: 1px dashed hsla(0, 0%, 0%, 0.3) !important;
        border-radius: 5px !important;
        }
        
       .thanks
       {
           font-size: 20px;
           padding: 50px;
           box-sizing: border-box;
           color: #555;
           text-align:center;
           line-height:1.5em;
       }

       .thanks .fa
       {
           font-size: 160px;
           color: #d44040;
       }

       #submit_btn
       {
           display: none;
       }
       
       .dropzone .dz-message
       {
           color: #ccc;
       }
       
       .dropzone
       {
           margin-bottom: 10px;
       }
       
       .dropzone .dz-message .fa-picture-o
       {
            font-size: 40px;
            margin-top: -20px;
            margin-bottom: 20px;
       }
    </style>

    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="/savely/css/dropzone.css" rel="stylesheet">

    <script src="/savely/js/dropzone.js"></script>
    <script src="/savely/js/report-fire.js"></script>
	<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUrsWAT00vuFuhc_GYPcJfoqlk0hFvczk&callback=initMap"></script>

    <script>
        var documentDropzone;

        Dropzone.options.documentDropzone = {
            url: '/savely/report_fire/',
            uploadMultiple: true,
            parallelUploads: 1,
            maxFilesize: 25, // MB
            maxThumbnailFilesize: 10, // MB
            thumbnailWidth: 500,
            thumbnailHeight: null,
            maxFiles: 100, // set hard limit to 100 files
            dictResponseError: '{{statusCode}} Error while uploading',
            dictDefaultMessage: '<i class="fa fa-picture-o"></i><br> Drop images of the fire or click to upload.',
            init: function () {
                documentDropzone = this;

                this.on('addedfile', function (file) {
                    var without_current_file = this.files.filter(function (val, idx, array) {
                        return file != val;
                    });

                    file.previewElement.addEventListener("click", function () {
                        documentDropzone.removeFile(file);
                    });
                });

                this.on('sending', function (file, xhr, formData) {
                    formData.append('uniqueName', file.uniqueName);
                });

                var error = false;
                this.on('error', function (file, errorMessage, xhr) {
                    error = true;
                });

                this.on('complete', function (file) {
                    if (error) { // exit if we have error
                        error = false;
                        return;
                    }
                });

                this.on('removedfile', function (file) {
                    if (!file.accepted) return; // exit if the file if not on the server
                });
            }
        };

        var getUploadedFiles = function () {
            var base64_st = '';
            for (var i = 0; i < documentDropzone.files.length; i++)
                base64_st += documentDropzone.files[i].previewElement.firstElementChild.firstChild.src + '#||#';

            return base64_st;
        }

        var submitFireData = function () {
            file_array.value = getUploadedFiles();
            fire_position.value = fireLocMarker.getPosition().lat() + ',' + fireLocMarker.getPosition().lng();

            submit_btn.click();
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <ext:ResourceManager ID="ResourceManager1" runat="server" Theme="Default" ScriptMode="Release">
        </ext:ResourceManager>

        <div class="cnt" style="margin: 0 auto;" runat="server" id="main_cnt">
            <h1>Report a Fire</h1>
            <h2><i class="fa fa-phone-square"></i> Emergency phone: 122 | <i class="fa fa-info-circle"></i> <a href="http://savely.con.mk/safety-instructions/" target="_blank">Emergency instructions</a></h2>
            <div id="map"></div>
            <input runat="server" id="name" class="input" placeholder="Enter your name here" />
            <input runat="server" id="phone" class="input" placeholder="Contact phone (optional)" />
            <input runat="server" id="desc" class="input" placeholder="Short description about the fire (optional)" style="margin-bottom: 30px;"></input>

            <div id="documentDropzone" class="dropzone"></div>

            <a href="javascript:void(0);" onclick="submitFireData()" class="btn"><i class='fa fa-fire'></i> Submit Report</a>
            <asp:Button runat="server" OnClick="SubmitReport" ID="submit_btn" />
            <asp:HiddenField runat="server" ID="file_array" />
            <asp:HiddenField runat="server" ID="fire_position" />
        </div>
    </form>
</body>
</html>