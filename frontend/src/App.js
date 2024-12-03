import axios from 'axios';  
import React, { Component } from 'react';  
import './App.css';  

const api = axios.create({  
  baseURL: "http://localhost:4000",  
});  

class App extends Component {  
  constructor() {  
    super();  

    this.state = {  
      search: "",  
      apiResponse: [],  
      torrentFile: null,  
      magnetLink: "",  
    };  

    this.fetch = this.fetch.bind(this);  
    this.handleFileChange = this.handleFileChange.bind(this);  
    this.handleMagnetLinkChange = this.handleMagnetLinkChange.bind(this);  
    this.handleFileUpload = this.handleFileUpload.bind(this);  
    this.handleMagnetLinkSubmit = this.handleMagnetLinkSubmit.bind(this);  
  }  

  async fetch() {  
    let url = this.get_url(this.state.search);  
    try {
      const response = await api.get(`/api/torrents/search?url=${encodeURIComponent(url)}`); // Corrected endpoint
      this.setState({ apiResponse: response.data });
      console.log("result", response.data);
    } catch (error) {
      console.error('Error fetching search results:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.error : 'An error occurred while fetching search results.');
    }
  }
    

  get_url(searchParam) {  
    return `https://apibay.org/q.php?q=${searchParam}&cat=100,200,300,400,600`;  
  }  

  handleFileChange(event) {  
    const file = event.target.files[0];  
    if (file && (file.type === "application/x-bittorrent" || file.name.endsWith('.torrent'))) {  
      this.setState({ torrentFile: file });  
    } else {  
      alert("Please upload a valid .torrent file.");  
      this.setState({ torrentFile: null });  
    }  
  }  

  handleMagnetLinkChange(event) {  
    this.setState({ magnetLink: event.target.value });  
  }  

  handleFileUpload = async () => {  
    const { torrentFile } = this.state;  
    if (!torrentFile) {  
      alert("Please select a .torrent file to upload.");  
      return;  
    }  

    const formData = new FormData();  
    formData.append('torrentFile', torrentFile);  

    try {  
      const response = await axios.post('http://localhost:4000/api/torrents/upload', formData, {  
        headers: {  
          'Content-Type': 'multipart/form-data',  
        },  
      });  
      console.log('File uploaded successfully:', response.data);  
      alert("File uploaded successfully!");  
    } catch (error) {  
      console.error('Error uploading file:', error.response ? error.response.data : error.message);  
      alert(error.response ? error.response.data.error : 'An error occurred during upload.');  
    }  
  };  

  handleMagnetLinkSubmit() {  
    const { magnetLink } = this.state;  
    if (magnetLink) {  
      api  
        .post('/api/torrents/process-magnet', { magnetLink })  
        .then((response) => {  
          console.log("Magnet link processed:", response.data);  
        })  
        .catch((error) => {  
          console.error("Error processing magnet link:", error);  
        });  
    } else {  
      alert("Please enter a magnet link.");  
    }  
  }  

  render() {  
    return (  
      <div>  
        <div className="container text-center">  
          <input  
            style={{ fontWeight: "bold", fontSize: "25px" }}  
            onChange={(e) => {  
              this.setState({ search: e.target.value });  
            }}  
            type="search"  
            id="form1"  
            className="form-control"  
          />  
          <button  
            onClick={this.fetch}  
            type="button"  
            className="btn btn-primary"  
          >  
            <i style={{ fontWeight: "bold", fontSize: "25px" }} className="fas fa-search">  
              search  
            </i>  
          </button>  
        </div>  

        <div className="container">  
          <table className="table">  
            <thead>  
              <tr>  
                <th scope="col" style={{ fontWeight: "bold", fontSize: "25px" }}>name</th>  
                <th scope="col" style={{ fontWeight: "bold", fontSize: "25px" }}>magnet</th>  
                <th scope="col" style={{ fontWeight: "bold", fontSize: "25px" }}>seeds</th>  
                <th scope="col" style={{ fontWeight: "bold", fontSize: "25px" }}>leecher</th>  
              </tr>  
            </thead>  
            <tbody  
              className="tableclass"  
              style={{  
                color: "white",  
                fontWeight: "bold",  
                fontSize: "25px",  
                overflow: "auto",  
                height: "100px",  
              }}  
            >  
              {this.state.apiResponse.map((item) => (  
                <tr key={item.info_hash}>  
                  <td>{item.name}</td>  
                  <td>  
                    <a  
                      href={`magnet:?xt=urn:btih:${item.info_hash}&dn=${item.name}${this.state.apitrack}`}  
                    >  
                      magnet  
                    </a>  
                  </td>  
                  <td>{item.seeders}</td>  
                  <td>{item.leechers}</td>  
                </tr>  
              ))}  
            </tbody>  
          </table>  
        </div>  

        <div className="container text-center">  
          <input  
            type="file"  
            accept=".torrent"  
            onChange={this.handleFileChange}  
            style={{ fontSize: "18px", margin: "10px" }}  
          />  
          <button  
            onClick={this.handleFileUpload}  
            className="btn btn-secondary"  
            style={{ fontSize: "18px" }}  
          >  
            Upload .torrent File  
          </button>  
        </div>  

        <div className="container text-center">  
          <input  
            type="text"  
            placeholder="Enter magnet link"  
            value={this.state.magnetLink}  
            onChange={this.handleMagnetLinkChange}  
            className="form-control"  
            style={{ fontSize: "18px", margin: "10px" }}  
          />  
          <button  
            onClick={this.handleMagnetLinkSubmit}  
            className="btn btn-secondary"  
            style={{ fontSize: "18px" }}  
          >  
            Process Magnet Link  
          </button>  
        </div>  
      </div>  
    );  
  }  
}  

export default App;
