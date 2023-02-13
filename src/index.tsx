import { useEffect, useState } from "react";
import { ActionPanel, List, Action, getPreferenceValues, LaunchType } from "@raycast/api";
import fetch from "node-fetch";

type Projects = {
  project: string;
  html_url: string;
  projects: Project[];
};

type Workspaces = {
  project: string;
  html_url: string;
  workspaces: Workspace[];
};

type Project = {
  url: string;
  html_url: string;
  name: string;
  display_name: string;
  status: string;
};

type Workspace = {
  url: string;
  html_url: string;
  id: number;
  name: string;
  domain: string;
};

export default function Command() {
  const [projects, setProjects] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspace, setWorkspace] = useState("");

  const { ACCESS_TOKEN } = getPreferenceValues();

  useEffect(() => {
    fetch("https://api.buddy.works/workspaces", {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setWorkspaces((data as any).workspaces);
      });
  }, []);

  useEffect(() => {
    if (workspace === "") {
      return;
    }

    fetch(`https://api.buddy.works/workspaces/${workspace}/projects`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects((data as any).projects);
      });
  }, [workspace]);

  return (
    <List
      searchBarAccessory={
        <List.Dropdown
          tooltip="Workspaces"
          onChange={(workspace) => {
            setWorkspace(workspace);
          }}
        >
          {(workspaces as Workspace[]).map((workspace, index) => {
            return <List.Dropdown.Item key={`workspace-${index}`} title={workspace.name} value={workspace.domain} />;
          })}
        </List.Dropdown>
      }
    >
      {(projects as Project[]).map((project, index) => {
        return (
          <List.Item
            key={`project-${index}`}
            title={project.name}
            actions={
              <ActionPanel title="Buddy">
                <Action.OpenInBrowser url={`${project.html_url}/pipelines`} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
