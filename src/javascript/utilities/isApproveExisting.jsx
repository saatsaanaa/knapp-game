export default function isApproveExisting(data) {
  console.log(data);
  if (data[0] !== undefined) {
    const approves = Object.values(data[0]);
    const userId = data[1];

    if (
      approves.filter((approve) => {
        return approve.id === userId;
      }).length === 0
    ) {
      console.log(false);
      return false;
    } else {
      console.log(true);
      return true;
    }
  } else {
    return false;
  }
}
