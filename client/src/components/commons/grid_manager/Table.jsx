import React from 'react'
import { Icon, Label, Menu, Table, Image } from 'semantic-ui-react'
import ButtonIcon from '../ButtonIcon.jsx';
import Helpers from '../helpers.js';
import R from 'ramda';


const TableHeader = (props) => {
  return (
    <Table.Row>
      <Table.HeaderCell>Header</Table.HeaderCell>
      <Table.HeaderCell>Header</Table.HeaderCell>
      <Table.HeaderCell>Header</Table.HeaderCell>
    </Table.Row>
  );
};


const _row = (records) => {
  return records.map((record) =>
  <Table.Row  key={record._id}>
    {_cells(record)}
  </Table.Row>);
};

const _cells = (record) => {
  return record.map((field) => {
      return (
        <Table.Cell  key={record._id}>
          {field.value}
        </Table.Cell>
      )
  });
};


const TableBody = (props) => {
  debugger;
  const rows = R.map(_row(props.model.records), props.model.records);
  return (
    <Table.Body>
      {rows}
    </Table.Body>
  )
};

const TableRow = (props) => {

};

const TableLayout = (props) => {
  return (<Table celled>
            <TableHeader {...props} />
            <TableBody {...props} />
        </Table>);
};




const TableLayout2 = (props) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Label ribbon>First</Label>
          </Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
        </Table.Row>
      </Table.Body>

      <Table.Footer>
      <Table.Row>
        <Table.HeaderCell colSpan='3'>
          <Menu floated='right' pagination>
            <Menu.Item as='a' icon>
              <Icon name='left chevron' />
            </Menu.Item>
            <Menu.Item as='a'>1</Menu.Item>
            <Menu.Item as='a'>2</Menu.Item>
            <Menu.Item as='a'>3</Menu.Item>
            <Menu.Item as='a'>4</Menu.Item>
            <Menu.Item as='a' icon>
              <Icon name='right chevron' />
            </Menu.Item>
          </Menu>
        </Table.HeaderCell>
      </Table.Row>
      </Table.Footer>
    </Table>
  )
}

export default TableLayout
