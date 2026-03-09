import React from 'react';
import { useParams } from 'react-router-dom';
import AllTasks from './AllTasks';

const ProjectView = () => {
  const { projectId } = useParams();
  return <AllTasks projectId={parseInt(projectId)} />;
};

export default ProjectView;

