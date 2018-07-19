import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class ReviewEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.location.state.event.category || 'play',
      pros: [],
      proEntry: 'this went well',
      cons: [],
      conEntry: 'do not make the same mistake twice',
      journal: 'a detailed journey inside my emotional experience',
      photo: '',
      redirect: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addPro = this.addPro.bind(this);
    this.addCon = this.addCon.bind(this);
    this.deletePro = this.deletePro.bind(this);
    this.deleteCon = this.deleteCon.bind(this);
    this.addPhoto = this.addPhoto.bind(this);
    this.encodeImageFileAsURL = this.encodeImageFileAsURL.bind(this);
  }
  handleChange(event) {
    const { name } = event.target;
    this.setState({
      [name]: event.target.value,
    });
  }
  handleSubmit() {
    this.props.location.state.event.category = this.state.category;
    axios.post('/api/addReview', {
      event: this.props.location.state.event,
      feedback: {
        pros: this.state.pros,
        cons: this.state.cons,
        journal: this.state.journal,
        photo: this.state.photo
      },
    })
      .then((response) => {
        console.log(`Successful axios post reviewEvent: ${response}`);
        this.refs.journal.value = '';
        this.setState({ redirect: true });
      })
      .catch((error) => {
        console.log(`Error from axios post reviewEvent: ${error}`);
      });
  }
  addPro() {
    this.setState({
      pros: this.state.pros.concat(this.state.proEntry),
    });
    this.refs.pro.value = '';
  }
  addCon() {
    this.setState({
      cons: this.state.cons.concat(this.state.conEntry),
    });
    this.refs.con.value = '';
  }
  deletePro(event) {
    this.setState({
      pros: this.state.pros.filter(pro => pro !== event.target.value),
    });
  }
  deleteCon(event) {
    this.setState({
      cons: this.state.cons.filter(con => con !== event.target.value),
    });
  }
  addPhoto(url) {
    this.setState({
      photo: url
    })
  }
  encodeImageFileAsURL(element) {
  const that = this;
  var file = element.target.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    that.addPhoto(reader.result);
  }
  reader.readAsDataURL(file);
}
  render() {
    return (
      <div className="body reviewEvent row justify-content-around">
        <div className="form reviewForm col-4">
          <h2>{this.props.location.state.event.title}</h2>
          <div className="form-group">
            <select className="custom-select mr-sm-2" id="inlineFormCustomSelect" name="category" onChange={this.handleChange} value={this.state.category}>
              <option value="work">work</option>
              <option value="play">play</option>
            </select>
          </div>

          <div className="form-group">
            <h6>Things You Did Well</h6>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                aria-label="Text input with segmented dropdown button"
                name="proEntry"
                onChange={this.handleChange}
                ref="pro"
              />
              <div className="input-group-append">
                <button className="btn btn-info" type="submit" onClick={this.addPro}>
                  <span className="fa fa-plus review-glyph" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-info dropdown-toggle dropdown-toggle-split"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="sr-only"><h6>Pros</h6></span>
                </button>
                <div className="dropdown-menu">
                  {this.state.pros.map((pro, i, pros) => (
                    <div className="dropdown-item" key={i}>
                      <h6>
                        {pro}
                        <button className="btn-outline-info deleteProsCons" type="submit" value={pros[i]} onClick={this.deletePro}>
                          <span className="fa fa-trash-alt review-glyph" />
                        </button>
                      </h6>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <h6>Things You Did Poorly<br /></h6>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                aria-label="Text input with segmented dropdown button"
                name="conEntry"
                onChange={this.handleChange}
                ref="con"
              />
              <div className="input-group-append">
                <button className="btn btn-info" type="submit" onClick={this.addCon}>
                  <span className="fa fa-plus review-glyph" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-info dropdown-toggle dropdown-toggle-split"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="sr-only"><h6>Cons</h6></span>
                </button>
                <div className="dropdown-menu">
                  {this.state.cons.map((con, i, cons) => (
                    <div className="dropdown-item" key={i}>
                      <h6>
                        {con}
                        <button className="btn-outline-info deleteProsCons" type="submit" value={cons[i]} onClick={this.deleteCon}>
                          <span className="fa fa-trash-alt review-glyph" />
                        </button>
                      </h6>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group">
          <h6>Upload an image of the Event</h6>
            <input
              type="file"
              className="form-control"
              name="photoEntry"
              onChange={this.encodeImageFileAsURL}
              ref="photo"
              accept=".jpg, .jpeg, .png"
            />
          </div>
          <div className="form-group">
            <h6>Further Reflections</h6>
            <textarea className="journalBox form-control" type="text" name="journal" onChange={this.handleChange} ref="journal" />
          </div>

          <button className="btn btn-outline-info" type="submit" onClick={this.handleSubmit}>Submit</button>

        </div>

        <div className="col-4">
          <img src="/assets/reviewCat.png" className="img-fluid align-self-center" alt="Responsive" />
        </div>

        {this.state.redirect && (
          <Redirect to="/" />
        )}

      </div>
    );
  }
}

export default ReviewEvent;
