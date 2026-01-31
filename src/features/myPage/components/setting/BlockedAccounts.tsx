import DetailHeader from "../../../../components/DetailHeader";
import Account from "./Account";

const dummyBlockedAccounts = [
  {
    id: 1,
    name: "KUIT",
    userID: "@KUIT_PM",
  },
  {
    id: 2,
    name: "위니",
    userID: "@woneee",
  },
];

export default function BlockedAccounts() {
  const hasBlockedAccounts = dummyBlockedAccounts.length > 0;

  return (
    <div>
      <DetailHeader title="차단한 계정" />
      {hasBlockedAccounts ? (
        <div className="h-[calc(100vh-48px)] bg-white py-3">
          <p className="px-4 text-[#B5B5B5] text-[14px]">
            {dummyBlockedAccounts.length}명
          </p>

          {dummyBlockedAccounts.map((account) => (
            <Account
              key={account.id}
              name={account.name}
              userID={account.userID}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-48px)] bg-white gap-10">
          <div className="w-25 h-25 bg-[#D9D9D9]" />
          <p className="text-[#787878] text-[16px]">차단한 계정이 없어요.</p>
        </div>
      )}
    </div>
  );
}
