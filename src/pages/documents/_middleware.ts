import type { Asset } from '#/lib/auth/contract';

import { UserRole } from '#/types/personnel';
import { PageRequiresAuthz } from '#/lib/auth/middleware/page';

const asset: Asset = {
  role: [UserRole.Admin, UserRole.TeamLeader, UserRole.SubTeamLeader],
};

export default PageRequiresAuthz(asset);
