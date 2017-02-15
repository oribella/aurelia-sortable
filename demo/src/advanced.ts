export class Nested {
  public groups = [
    { name: 'Odd', typeFlag: 1, items: [] },
    { name: 'Even', typeFlag: 2, items: [] },
    {
      name: 'Numbers', typeFlag: 3, items: Array.from(Array(11), (_, i) => i).map((i) => {
        return {
          name: i === 0 ? 'π' : i,
          typeFlag: i % 2 === 0 ? 2 : 1,
          lockedFlag: i === 0 ? 3 : 0
        };
      })
    }
  ];
}
