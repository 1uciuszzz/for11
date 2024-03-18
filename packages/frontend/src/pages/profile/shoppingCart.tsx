import ky, { HTTPError } from "ky";
import {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useImmer } from "use-immer";
import { File, Product } from "../../types";
import { useLoadingStore } from "../../stores/loading";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/pagination";

interface NewProductFormProps {}

interface NewProductFormHandles {
  open: () => void;
}

const NewProductForm = forwardRef<NewProductFormHandles, NewProductFormProps>(
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

    const [count, setCount] = useImmer<number>(0);

    const [price, setPrice] = useImmer<number>(0);

    const [preview, setPreview] = useImmer<string>("");

    const previewInputRef = useRef<HTMLInputElement | null>(null);

    const handlePreview = async (e: ChangeEvent<HTMLInputElement>) => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth/signin");
      const file = e.target.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append("file", file);
      try {
        setIsLoading(true);
        const res = await ky.post("/api/files", {
          body: fd,
          headers: { Authorization: token },
        });
        const data: File = await res.json();
        setPreview(data.id);
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

    const handleCreateNewProduct = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth/signin");
      try {
        setIsLoading(true);
        const res = await ky.post("/api/products", {
          json: { name, description, count, price, preview },
          headers: { Authorization: token },
        });
        await res.json();
        dialogRef.current!.close();
        setName("");
        setDescription("");
        setCount(0);
        setPrice(0);
        setPreview("");
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
          <h3 className="font-bold text-lg">Create new product</h3>
          <form
            className="flex flex-col space-y-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateNewProduct();
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
            <label className="input input-primary flex items-center gap-2">
              <span className="text-gray-400">Count</span>
              <input
                type="number"
                className="grow"
                placeholder="Count"
                value={count}
                onChange={(e) => setCount(+e.target.value)}
              />
            </label>
            <label className="input input-primary flex items-center gap-2">
              <span className="text-gray-400">Price</span>
              <input
                type="number"
                className="grow"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(+e.target.value)}
              />
            </label>
            {preview ? (
              <img
                className="h-32 aspect-video object-cover"
                src={`/api/files/${preview}`}
                alt="preview img"
              />
            ) : null}
            <input
              type="button"
              value="Upload Preview"
              className="btn btn-ghost"
              onClick={() => previewInputRef.current?.click()}
            />
            <input
              type="file"
              ref={previewInputRef}
              hidden
              onChange={handlePreview}
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

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onPurchased: (id: string) => void;
}

const ProductsTable = ({
  products,
  onDelete,
  onPurchased,
}: ProductsTableProps) => {
  return (
    <div className="grid grid-cols-5 gap-8">
      {products.map((product) => {
        return (
          <div
            key={product.id}
            className={`card border ${
              product.purchasedAt ? "border-success" : "border-warning"
            }`}
          >
            <figure>
              <img
                src={`/api/files/${product.preview}`}
                alt="product preview"
              />
            </figure>
            <div className="card-body">
              <h2
                className={`card-title line-clamp-1 ${
                  product.purchasedAt ? "line-through" : ""
                }`}
              >
                {`${product.purchasedAt ? "✅" : ""}`}
                {product.name}
              </h2>
              <p className="line-clamp-3 text-sm">{product.description}</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-xs btn-circle btn-ghost"
                  onClick={() => onDelete(product.id)}
                >
                  🗑️
                </button>
                {product.purchasedAt ? null : (
                  <button
                    className="btn btn-xs btn-circle btn-ghost"
                    onClick={() => onPurchased(product.id)}
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

const ShoppingCart = () => {
  const navigate = useNavigate();

  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const NewProductFormRef = useRef<NewProductFormHandles>(null);

  const openCreateNewProductModal = () => {
    NewProductFormRef.current?.open();
  };

  const [products, setProducts] = useImmer<Product[]>([]);

  const [page, setPage] = useImmer<number>(1);

  const [limit] = useImmer<number>(5);

  const [total, setTotal] = useImmer<number>(0);

  const [name, setName] = useImmer<string>("");

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      const res = await ky.get("/api/products", {
        searchParams: { page, limit, name },
        headers: { Authorization: token },
      });
      const data: { total: number; products: Product[] } = await res.json();
      setProducts(data.products);
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
      await ky.delete(`/api/products/${id}`, {
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
  }, [page]);

  const handlePurchased = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth/signin");
    try {
      setIsLoading(true);
      await ky.patch(`/api/products/${id}`, {
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
          <h2 className="card-title">Shopping Cart</h2>
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

              <button
                className="btn btn-ghost w-32"
                onClick={openCreateNewProductModal}
              >
                Create
              </button>
            </form>

            <ProductsTable
              products={products}
              onDelete={handleDelete}
              onPurchased={handlePurchased}
            />

            <Pagination
              page={page}
              count={Math.ceil(total / limit)}
              onChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>

      <NewProductForm ref={NewProductFormRef} />
    </>
  );
};

export default ShoppingCart;
