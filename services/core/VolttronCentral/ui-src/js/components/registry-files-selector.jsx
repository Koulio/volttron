'use strict';


import React from 'react';
import BaseComponent from './base-component';

var devicesActionCreators = require('../action-creators/devices-action-creators');
var modalActionCreators = require('../action-creators/modal-action-creators');
var devicesStore = require('../stores/devices-store');

class RegistryFilesSelector extends BaseComponent {   
    constructor(props) {
        super(props);
        this._bind("_loadRegistryFile", "_closeModal", "_onStoresChange", "_showTooltip", "_hideTooltip");

        this.state = {
            registryFiles: devicesStore.getSavedRegistryFiles(),
            showTooltip: {}
        };
    }
    componentDidMount() {
        devicesStore.addChangeListener(this._onStoresChange);        
    }
    componentWillUnmount() {
        devicesStore.removeChangeListener(this._onStoresChange);
    }
    _onStoresChange() {
        this.setState({ registryFiles: devicesStore.getSavedRegistryFiles()});
    }
    _loadRegistryFile (registryFile) {
        devicesActionCreators.loadRegistryFile(
            registryFile, 
            this.props.device
        );

        modalActionCreators.closeModal();
    }
    _closeModal (e) {
        if (e.target === e.currentTarget)
        {
            modalActionCreators.closeModal();
        }
    }
    _showTooltip(index, evt) {

        this.setState({showTooltip: toggleTooltip(index, true)});
    }
    _hideTooltip(index, evt) {
        
        this.setState({showTooltip: toggleTooltip(index, false)});
    }
    render() {

        var filesList;

        if (this.state.registryFiles)
        {    
            filesList = this.state.registryFiles.files.map(function (registryFile, index) {

                var strIndex = index.toString();

                var showTooltip = this.state.showTooltip.hasOwnProperty(strIndex) && this.state.showTooltip[strIndex];

                var tooltipStyle = {
                    display: (showTooltip ? "block" : "none"),
                    position: "absolute",
                    top: "-30px",
                    left: "-10px",
                    color: "black"
                };

                var toolTipClasses = (showTooltip ? "tooltip_outer delayed-show-slow" : "tooltip_outer");

                return (
                    <div key={registryFile + "-rf"}
                        className="registry-file"
                        onClick={this._loadRegistryFile.bind(this, registryFile)}
                        onMouseEnter={this._showTooltip.bind(this, index)}
                        onMouseLeave={this._hideTooltip.bind(this, index)}> 
                        <div className={toolTipClasses}
                            style={tooltipStyle}>
                            <div className="tooltip_inner">
                                <div className="opaque_inner">
                                    {registryFile}
                                </div>
                            </div>
                        </div>           
                        <div>
                            <i className="fa fa-file"></i>
                        </div>
                        <div className="registry-file-name">
                            {registryFile}
                        </div>
                    </div>
                );
            }, this);
        }

        return (
            <div className="registryFilesList">
                <h3>Previously Configured Registry Files</h3>
                <div>
                    {filesList}
                </div>
            </div>
        );
    }
};

var toggleTooltip = (index, toggle) => {
    var strIndex = index.toString();
    var showTooltip = {};
    showTooltip[strIndex] = toggle;
    return showTooltip;
}

module.exports = RegistryFilesSelector;