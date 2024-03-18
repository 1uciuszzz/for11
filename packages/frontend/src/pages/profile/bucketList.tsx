import ky, { HTTPError } from "ky";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { useLoadingStore } from "../../stores/loading";
import { Bucket } from "../../types";
import Pagination from "../../components/pagination";

interface BucketsTableProps {
  buckets: Bucket[];
  onDelete: (id: string) => void;
  onFinish: (id: string) => void;
}

const BucketsTable = ({ buckets, onDelete, onFinish }: BucketsTableProps) => {
  return (
    <div className="grid grid-cols-5 gap-8">
      {buckets.map((bucket) => {
        return (
          <div
            key={bucket.id}
            className={`card border ${
              bucket.finishedAt ? "border-success" : "border-warning"
            }`}
          >
            <div className="card-body">
              <h2
                className={`card-title line-clamp-1 ${
                  bucket.finishedAt ? "line-through" : ""
                }`}
              >
                {`${bucket.finishedAt ? "✅" : ""}`}
                {bucket.name}
              </h2>
              <p className="line-clamp-3 text-sm">{bucket.description}</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-xs btn-circle btn-ghost"
                  onClick={() => onDelete(bucket.id)}
                >
                  🗑️
                </button>
                {bucket.finishedAt ? null : (
                  <button
                    className="btn btn-xs btn-circle btn-ghost"
                    onClick={() => onFinish(bucket.id)}
                  >
                    ✅
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface NewBucketFormHandles {
  open: () => void;
}

interface NewBucketFormProps {}

const NewBucketForm = forwardRef<NewBucketFormHandles, NewBucketFormProps>(
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

    const [description, setDescription] = useImmer<string>("");

    const handleSave = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth/signin");
      try {
        setIsLoading(true);
        const res = await ky.post("/api/buckets", {
          json: { name, description },
          headers: { Authorization: token },
        });
        await res.json();
        dialogRef.current!.close();
        setName("");
        setDescription("");
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
          <h3 className="font-bold text-lg">Create new bucket</h3>
          <form
            className="flex flex-col space-y-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <input
              type="text"
              className="input input-primary"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              rows={3}
              className="textarea textarea-primary"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

const BucketList = () => {
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const navigate = useNavigate();

  const NewBucketFormRef = useRef<NewBucketFormHandles>(null);

  const [page, setPage] = useImmer<number>(1);

  const [limit] = useImmer<number>(5);

  const [total, setTotal] = useImmer<number>(0);

  const [buckets, setBuckets] = useImmer<Bucket[]>([]);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      const res = await ky.get("/api/buckets", {
        headers: { Authorization: token },
        searchParams: { page, limit },
      });
      const data: { total: number; buckets: Bucket[] } = await res.json();
      setTotal(() => data.total);
      setBuckets(() => data.buckets);
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

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      await ky.delete(`/api/buckets/${id}`, {
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
    }
  };

  const handleFinish = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      await ky.patch(`/api/buckets/${id}`, {
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
    }
  };

  return (
    <>
      <div className="card backdrop-blur-xl shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Bucket List</h2>
          <div className="flex flex-col space-y-16">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex items-center space-x-16"
            >
              <button
                className="btn btn-ghost w-32"
                onClick={() => NewBucketFormRef.current?.open()}
              >
                Create
              </button>
            </form>

            <BucketsTable
              buckets={buckets}
              onDelete={handleDelete}
              onFinish={handleFinish}
            />

            <Pagination
              page={page}
              count={Math.ceil(total / limit)}
              onChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>

      <NewBucketForm ref={NewBucketFormRef} />
    </>
  );
};

export default BucketList;
