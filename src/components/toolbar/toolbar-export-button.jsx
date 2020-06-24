import React from 'react';
import PropTypes from 'prop-types';
import {FaFileExport as IconExport} from 'react-icons/fa';
import ToolbarButton from './toolbar-button';
import { csvDownload }  from '../../utils/browser';
import { Project } from '../../class/export';

export default function ToolbarExportButton({state}, {translator}) {

  let saveProjectElementsToFile = e => {
    e.preventDefault();
    state = Project.unselectAll( state ).updatedState;
    const scene = state.get('scene').toJS();

    const csvResult = [];

    _.map(scene.layers, layer => {
      const layerVertices = layer.vertices;
      const layerLines = layer.lines;

      for (var key in layerLines) {
        if (layerLines.hasOwnProperty(key)) {
          const line = layerLines[key];
          if (_.isNil(line)) continue;
          if (_.isNil(line.vertices[0]) || _.isNil(layerVertices[line.vertices[0]])) continue;
          if (_.isNil(line.vertices[1]) || _.isNil(layerVertices[line.vertices[1]])) continue;

          const row = {
            Wall_Id: line.id,
            Sx: _.get(layerVertices[line.vertices[0]], 'x', 0),
            Sy: _.get(layerVertices[line.vertices[0]], 'y', 0),
            Ex: _.get(layerVertices[line.vertices[1]], 'x', 0),
            Ey: _.get(layerVertices[line.vertices[1]], 'y', 0),
            H: line.properties.height && line.properties.height.length ? line.properties.height.length : 300,
            Wall_Type: 'Perimeter',
            Wall_Face_A: line.properties.textureA,
            Wall_Face_B: line.properties.textureB
          };
          csvResult.push(row);
        }
      }
    });

    csvDownload(csvResult);
  };

  return (
    <ToolbarButton active={false} tooltip={translator.t('Export project')} onClick={saveProjectElementsToFile}>
      <IconExport />
    </ToolbarButton>
  );
}

ToolbarExportButton.propTypes = {
  state: PropTypes.object.isRequired,
};

ToolbarExportButton.contextTypes = {
  translator: PropTypes.object.isRequired,
};
