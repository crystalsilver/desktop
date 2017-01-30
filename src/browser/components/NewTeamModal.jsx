const React = require('react');
const {Modal, Button, FormGroup, FormControl, ControlLabel, HelpBlock} = require('react-bootstrap');
const validUrl = require('valid-url');

class NewTeamModal extends React.Component {

  constructor() {
    super();
    this.state = {
      teamName: '',
      teamUrl: '',
      saveStarted: false
    };
  }

  componentWillMount() {
    this.state = {
      teamName: this.props.team ? this.props.team.name : '',
      teamUrl: this.props.team ? this.props.team.url : '',
      teamIndex: this.props.team ? this.props.team.index : false,
      saveStarted: false
    };
  }

  getTeamNameValidationError() {
    if (!this.state.saveStarted) {
      return null;
    }
    return this.state.teamName.length > 0 ? null : 'Name is required.';
  }

  getTeamNameValidationState() {
    return this.getTeamNameValidationError() === null ? null : 'error';
  }

  handleTeamNameChange(e) {
    this.setState({
      teamName: e.target.value
    });
  }

  getTeamUrlValidationError() {
    if (!this.state.saveStarted) {
      return null;
    }
    if (this.state.teamUrl.length === 0) {
      return 'URL is required.';
    }
    if (!validUrl.isUri(this.state.teamUrl)) {
      return 'URL should start with http:// or https://.';
    }
    return null;
  }

  getTeamUrlValidationState() {
    return this.getTeamUrlValidationError() === null ? null : 'error';
  }

  handleTeamUrlChange(e) {
    this.setState({
      teamUrl: e.target.value
    });
  }

  getError() {
    return this.getTeamNameValidationError() || this.getTeamUrlValidationError();
  }

  validateForm() {
    return this.getTeamNameValidationState() === null &&
           this.getTeamUrlValidationState() === null;
  }

  save() {
    this.setState({
      saveStarted: true
    }, () => {
      if (this.validateForm()) {
        this.props.onSave({
          url: this.state.teamUrl,
          name: this.state.teamName,
          index: this.state.teamIndex
        });
      }
    });
  }

  render() {
    return (
      <Modal
        show={true}
        id='newServerModal'
        onHide={this.props.onClose}
        onKeyDown={(e) => {
          switch (e.key) {
          case 'Enter':
            this.save();

            // The add button from behind this might still be focused
            e.preventDefault();
            e.stopPropagation();
            break;
          case 'Escape':
            this.props.onClose();
            break;
          }
        }}
      >
        <Modal.Header>
          <Modal.Title>{'Add Server'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <FormGroup
              validationState={this.getTeamNameValidationState()}
            >
              <ControlLabel>{'Server Display Name'}</ControlLabel>
              <FormControl
                id='teamNameInput'
                type='text'
                value={this.state.teamName}
                placeholder='Server Name'
                onChange={this.handleTeamNameChange.bind(this)}
              />
              <FormControl.Feedback/>
              <HelpBlock>{'The name of the server displayed on your desktop app tab bar.'}</HelpBlock>
            </FormGroup>
            <FormGroup
              validationState={this.getTeamUrlValidationState()}
            >
              <ControlLabel>{'Team URL'}</ControlLabel>
              <FormControl
                id='teamUrlInput'
                type='text'
                value={this.state.teamUrl}
                placeholder='https://example.com'
                onChange={this.handleTeamUrlChange.bind(this)}
              />
              <FormControl.Feedback/>
              <HelpBlock>{'The URL of your Mattermost server. Must start with http:// or https://.'}</HelpBlock>
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div
            className='pull-left modal-error'
          >
            {this.getError()}
          </div>

          <Button
            id='cancelNewServerModal'
            onClick={this.props.onClose}
          >{'Cancel'}</Button>
          <Button
            id='saveNewServerModal'
            onClick={this.save.bind(this)}
            disabled={!this.validateForm()}
            bsStyle='primary'
          >{'Add'}</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

NewTeamModal.propTypes = {
  onClose: React.PropTypes.func,
  onSave: React.PropTypes.func,
  team: React.PropTypes.object
};

module.exports = NewTeamModal;
