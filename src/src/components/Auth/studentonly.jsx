import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import StudentOnly from "../../Warning/one";

const StudentGuard = ({ children }) => {
  const { user, loading } = useSelector((state) => state.profile);

  // wait for restoreUser to finish
  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  // not a student
  if (!user || user.accountType !== ACCOUNT_TYPE.STUDENT) {
    return <StudentOnly />;
  }

  // student
  return children;
};

export default StudentGuard