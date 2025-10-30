import AddModal from "./AddModal.jsx";
import RemoveModal from "./RemoveModal.jsx";
import ReNameModal from "./ReNameModal.jsx";

const modals = new Map([
  ['adding', AddModal],
  ['removing', RemoveModal],
  ['renaming', ReNameModal],
]);

export default modalName => modals.get(modalName);