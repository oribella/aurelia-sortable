export class Nested {
  public groups = [
      { name: 'Group 01', type: 1, items: [
        {id: '10', type: 1, name: 'item 10 type 1'},
        {id: '11', type: 1, name: 'item 11 type 1'},
        {id: '12', type: 1, name: 'item 12 type 1'}
        ]
      },
      { name: 'Group 02', type: 2, items: [
        {id: '23', type: 2, name: 'item 23 type 2'},
        {id: '24', type: 2, name: 'item 24 type 2'},
        {id: '25', type: 2, name: 'item 25 type 2'}
        ] },
      { name: 'Group 03', type: 3, items: [
        {id: '33', type: 3, name: 'item 33 type 3'},
        {id: '34', type: 3, name: 'item 34 type 3'},
        {id: '35', type: 3, name: 'item 35 type 3'}
        ] }
    ];
}
