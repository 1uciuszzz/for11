import ky, { HTTPError } from "ky";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useImmer } from "use-immer";
import { Account } from "../../types";
import { useLoadingStore } from "../../stores/loading";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/pagination";

interface NewAccountFormProps {}

interface NewAccountFormHandles {
  open: () => void;
}

const NewAccountForm = forwardRef<NewAccountFormHandles, NewAccountFormProps>(
  (_, ref) => {
    const navigate = useNavigate();

    const setIsLoading = useLoadingStore((state) => state.setIsLoading);

    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useImperativeHandle(ref, () => {
      return {
        open: () => {
          dialogRef.current!.showModal();
        },
      };
    });

    const [name, setName] = useImmer<string>("");

    const [balance, setBalance] = useImmer<number>(0);

    const [date, setDate] = useImmer<string>(new Date().toString());

    const handleCreateNewAccount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth/signin");
      try {
        setIsLoading(true);
        const proccessedDate = new Date(date).getTime().toString();
        const res = await ky.post("/api/accounts", {
          json: { name, balance, date: proccessedDate },
          headers: { Authorization: token },
        });
        await res.json();
        dialogRef.current!.close();
        setName("");
        setBalance(0);
        setDate(new Date().toString());
      } catch (e) {
        if (e instanceof HTTPError && e.response.status == 401) {
          localStorage.clear();
          navigate("/auth/signin");
        } else {
          console.error(e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create new spending</h3>
          <form
            className="flex flex-col space-y-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateNewAccount();
            }}
          >
            <input
              type="text"
              className="input input-primary"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              className="input input-primary"
              placeholder="Balance"
              value={balance}
              onChange={(e) => setBalance(+e.target.value)}
            />
            <input
              type="date"
              className="input input-primary"
              placeholder="Date"
              value={new Date(date).toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    );
  }
);

const AccountsTable = ({
  accounts,
  onDelete,
}: {
  accounts: Account[];
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Accounts List</h2>
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Balance</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => {
              return (
                <tr key={account.id}>
                  <th>{index + 1}</th>
                  <td>{account.name}</td>
                  <td>{account.balance}</td>
                  <td>{new Date(+account.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-circle btn-ghost btn-xs"
                      onClick={() => onDelete(account.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SettleAccounts = () => {
  const navigate = useNavigate();

  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const NewAccountFormRef = useRef<NewAccountFormHandles>(null);

  const openCreateNewAccountModal = () => {
    NewAccountFormRef.current?.open();
  };

  const [accounts, setAccounts] = useImmer<Account[]>([]);

  const [page, setPage] = useImmer<number>(1);

  const [limit] = useImmer<number>(9);

  const [total, setTotal] = useImmer<number>(0);

  const [name, setName] = useImmer<string>("");

  const [month, setMonth] = useImmer<string>("");

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      const res = await ky.get("/api/accounts", {
        searchParams: { page, limit, name, month },
        headers: { Authorization: token },
      });
      const data: { total: number; accounts: Account[] } = await res.json();
      setAccounts(data.accounts);
      setTotal(data.total);
    } catch (e) {
      if (e instanceof HTTPError && e.response.status == 401) {
        localStorage.clear();
        navigate("/auth/signin");
      } else {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      await ky.delete(`/api/accounts/${id}`, {
        headers: { Authorization: token },
      });
      handleSearch();
    } catch (e) {
      if (e instanceof HTTPError && e.response.status == 401) {
        localStorage.clear();
        navigate("/auth/signin");
      } else {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
      handleSearch();
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, month]);

  return (
    <>
      <div className="card backdrop-blur-xl shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Settle Accounts</h2>
          <div className="flex flex-col space-y-16">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center space-x-16"
            >
              <input
                type="text"
                className="input bg-transparent input-bordered w-64"
                placeholder="Search Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button type="submit" className="btn btn-ghost w-32">
                Search
              </button>

              <input
                type="month"
                className="input bg-transparent input-bordered w-64"
                placeholder="Month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />

              <button
                className="btn btn-ghost w-32"
                onClick={openCreateNewAccountModal}
              >
                Create
              </button>
            </form>

            <AccountsTable accounts={accounts} onDelete={handleDelete} />

            <Pagination
              page={page}
              count={Math.ceil(total / limit)}
              onChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>

      <NewAccountForm ref={NewAccountFormRef} />
    </>
  );
};

export default SettleAccounts;
