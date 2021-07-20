/**
 * An abbreviated model of StudyMember.
 * Only contains the core fields.
 */
type MStudyMember = {
  userFullname: string
  userHandle: string
  startDateStr: string
  uid: string
  repo: string
  active: boolean
}

export default MStudyMember
